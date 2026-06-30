import { useEffect, useState, useCallback, useRef } from "react";
import { useLocationStore } from "../store/stores";
import {
  getGeoHashBounds,
  geoDistance,
  calculateDistance,
  formatDistance,
} from "../utils/geoUtils";
import {
  getPostsByGeoHashBounds,
  getEventsByGeoHashBounds,
  getUserProfile,
} from "../services/firestoreService";

// ===== useNearbyPosts =====

/**
 * Hook untuk mengambil posts di area sekitar user.
 * Menggunakan multi-range GeoHash query dari geofire-common
 * untuk hasil yang akurat di boundary hash.
 *
 * @param {number} radiusKm - Radius pencarian dalam km (default: 1)
 * @returns {{ nearbyPosts: Array, loading: boolean, error: string|null, refresh: Function }}
 */
export const useNearbyPosts = (radiusKm = 1) => {
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const fetchNearbyPosts = useCallback(async () => {
    if (!currentLocation) return;

    setLoading(true);
    setError(null);
    try {
      const { latitude, longitude } = currentLocation;

      // 1. Hitung GeoHash bounds untuk radius
      const bounds = getGeoHashBounds(latitude, longitude, radiusKm);
      if (bounds.length === 0) {
        setNearbyPosts([]);
        return;
      }

      // 2. Query Firestore dengan multi-range bounds
      const rawPosts = await getPostsByGeoHashBounds(bounds);

      // 3. Filter client-side: hanya posts yang benar-benar dalam radius
      //    (GeoHash bounds bisa mengembalikan hasil di luar radius)
      const filteredPosts = rawPosts
        .map((post) => {
          if (!post.lat || !post.lng) return null;
          const distance = geoDistance(
            latitude,
            longitude,
            post.lat,
            post.lng,
          );
          if (distance <= radiusKm) {
            return {
              ...post,
              distance,
              distanceLabel: formatDistance(distance),
            };
          }
          return null;
        })
        .filter(Boolean);

      // 4. Sort by jarak terdekat
      filteredPosts.sort((a, b) => a.distance - b.distance);

      setNearbyPosts(filteredPosts);
    } catch (err) {
      console.error("[useNearbyPosts] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, radiusKm]);

  useEffect(() => {
    fetchNearbyPosts();
  }, [fetchNearbyPosts]);

  return { nearbyPosts, loading, error, refresh: fetchNearbyPosts };
};

// ===== useNearbyPeople =====

/**
 * Hook untuk menemukan orang-orang di sekitar.
 *
 * Logika: Cari posts yang ada di radius → kelompokkan berdasarkan authorId
 * → ambil profil user untuk setiap author unik → filter yang privacy-nya
 * bukan "hidden" atau invisibleMode.
 *
 * Sesuai project plan:
 * "Nearby People: list akun publik yang pernah posting di area ≤ radius pilihan"
 *
 * @param {number} radiusKm - Radius pencarian dalam km (default: 1)
 * @returns {{ nearbyPeople: Array, loading: boolean, error: string|null, refresh: Function }}
 */
export const useNearbyPeople = (radiusKm = 1) => {
  const [nearbyPeople, setNearbyPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLocation = useLocationStore((state) => state.currentLocation);
  // Prevent concurrent fetches
  const fetchingRef = useRef(false);

  const fetchNearbyPeople = useCallback(async () => {
    if (!currentLocation || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const { latitude, longitude } = currentLocation;

      // 1. Hitung GeoHash bounds untuk radius
      const bounds = getGeoHashBounds(latitude, longitude, radiusKm);
      if (bounds.length === 0) {
        setNearbyPeople([]);
        return;
      }

      // 2. Query posts dalam radius (sama seperti useNearbyPosts)
      const rawPosts = await getPostsByGeoHashBounds(bounds);

      // 3. Filter posts yang benar-benar dalam radius
      const postsInRadius = rawPosts.filter((post) => {
        if (!post.lat || !post.lng) return false;
        const distance = geoDistance(latitude, longitude, post.lat, post.lng);
        return distance <= radiusKm;
      });

      // 4. Kelompokkan berdasarkan authorId
      //    Simpan post terdekat untuk setiap author (sebagai lokasi referensi)
      const authorMap = new Map();
      for (const post of postsInRadius) {
        const distance = geoDistance(
          latitude,
          longitude,
          post.lat,
          post.lng,
        );

        const existing = authorMap.get(post.authorId);
        if (!existing || distance < existing.distance) {
          authorMap.set(post.authorId, {
            authorId: post.authorId,
            distance,
            distanceLabel: formatDistance(distance),
            latestPostLat: post.lat,
            latestPostLng: post.lng,
            postCount: (existing?.postCount || 0) + 1,
          });
        } else {
          existing.postCount += 1;
        }
      }

      // 5. Ambil profil user untuk setiap author unik
      const authorIds = Array.from(authorMap.keys());
      const profilePromises = authorIds.map(async (authorId) => {
        try {
          const profile = await getUserProfile(authorId);
          return { authorId, profile };
        } catch {
          return { authorId, profile: null };
        }
      });

      const profiles = await Promise.all(profilePromises);

      // 6. Gabungkan data author + profile
      //    Filter: skip user tanpa profil, skip yang privacy mode = "hidden", skip invisibleMode
      const people = [];
      for (const { authorId, profile } of profiles) {
        if (!profile) continue;

        // Cek privacy settings
        const privacy = profile.locationPrivacy || {
          mode: "hidden",
          invisibleMode: false,
        };
        if (privacy.mode === "hidden" || privacy.invisibleMode) continue;

        const authorData = authorMap.get(authorId);
        people.push({
          id: authorId,
          displayName: profile.displayName || "Anonymous",
          photoURL: profile.photoURL || null,
          bio: profile.bio || "",
          distance: authorData.distance,
          distanceLabel: authorData.distanceLabel,
          postCount: authorData.postCount,
          followersCount: profile.followersCount || 0,
          followingCount: profile.followingCount || 0,
          privacyMode: privacy.mode, // "exact" atau "blurred"
        });
      }

      // 7. Sort by jarak terdekat
      people.sort((a, b) => a.distance - b.distance);

      setNearbyPeople(people);
    } catch (err) {
      console.error("[useNearbyPeople] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [currentLocation, radiusKm]);

  useEffect(() => {
    fetchNearbyPeople();
  }, [fetchNearbyPeople]);

  return { nearbyPeople, loading, error, refresh: fetchNearbyPeople };
};

// ===== useNearbyEvents =====

/**
 * Hook untuk menemukan events publik di area sekitar.
 *
 * Sesuai project plan:
 * "Event Discovery: peta event publik dalam radius tertentu"
 *
 * @param {number} radiusKm - Radius pencarian dalam km (default: 5)
 * @returns {{ nearbyEvents: Array, loading: boolean, error: string|null, refresh: Function }}
 */
export const useNearbyEvents = (radiusKm = 5) => {
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentLocation = useLocationStore((state) => state.currentLocation);

  const fetchNearbyEvents = useCallback(async () => {
    if (!currentLocation) return;

    setLoading(true);
    setError(null);
    try {
      const { latitude, longitude } = currentLocation;

      // 1. Hitung GeoHash bounds untuk radius
      const bounds = getGeoHashBounds(latitude, longitude, radiusKm);
      if (bounds.length === 0) {
        setNearbyEvents([]);
        return;
      }

      // 2. Query events dengan multi-range bounds
      const rawEvents = await getEventsByGeoHashBounds(bounds);

      // 3. Filter client-side: hanya events dalam radius yang sebenarnya
      const now = new Date();
      const filteredEvents = rawEvents
        .map((event) => {
          if (!event.lat || !event.lng) return null;
          const distance = geoDistance(
            latitude,
            longitude,
            event.lat,
            event.lng,
          );
          if (distance <= radiusKm) {
            // Tentukan status event (upcoming / ongoing / past)
            let status = "upcoming";
            if (event.startDate) {
              const startDate = event.startDate.toDate
                ? event.startDate.toDate()
                : new Date(event.startDate);
              const endDate = event.endDate
                ? event.endDate.toDate
                  ? event.endDate.toDate()
                  : new Date(event.endDate)
                : null;

              if (endDate && now > endDate) {
                status = "past";
              } else if (now >= startDate) {
                status = "ongoing";
              }
            }

            return {
              ...event,
              distance,
              distanceLabel: formatDistance(distance),
              status,
              goingCount: event.rsvpCounts?.going || 0,
              interestedCount: event.rsvpCounts?.interested || 0,
            };
          }
          return null;
        })
        .filter(Boolean);

      // 4. Sort: ongoing dulu, lalu upcoming, terakhir past. Dalam group, sort by jarak
      const statusOrder = { ongoing: 0, upcoming: 1, past: 2 };
      filteredEvents.sort((a, b) => {
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff;
        return a.distance - b.distance;
      });

      setNearbyEvents(filteredEvents);
    } catch (err) {
      console.error("[useNearbyEvents] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, radiusKm]);

  useEffect(() => {
    fetchNearbyEvents();
  }, [fetchNearbyEvents]);

  return { nearbyEvents, loading, error, refresh: fetchNearbyEvents };
};
