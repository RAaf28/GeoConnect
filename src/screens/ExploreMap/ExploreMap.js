import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { Image } from 'expo-image';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useMapSettingsStore, useLocationStore } from '../../store/stores';
import { getMapViewConfig } from '../../utils/mapTheme';
import { useWatchLocation, useLocationPermission } from '../../hooks/useLocation';
import { subscribeToPostsNearby, subscribeToEventsNearby, getUserProfile } from '../../services/firestoreService';
import { encodeGeoHash, getGeoHashPrecisionForRadius } from '../../utils/geoUtils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MIN = 200;
const BOTTOM_SHEET_MAX = SCREEN_HEIGHT * 0.65;

// Default fallback location (Jakarta)
const DEFAULT_REGION = {
  latitude: -6.324260,
  longitude: 106.791550,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const RADIUS_OPTIONS = [
  { label: '500m', value: 0.5 },
  { label: '1km', value: 1.0 },
  { label: '5km', value: 5.0 },
];

// Dark mode map style lives in mapTheme util (getMapViewConfig)

// Post card component for the bottom sheet
const PostCard = React.memo(({ post, onPress, isDark }) => {
  const authorInitial = (post.authorName || 'E').charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.postCard, isDark && styles.postCardDark]}
      onPress={() => onPress(post.id, post.type)}
      activeOpacity={0.7}
    >
      {post.imageURL ? (
        <View style={styles.postImageContainer}>
          <Image
            source={{ uri: post.imageURL }}
            style={styles.postImage}
            contentFit="cover"
            transition={200}
          />
        </View>
      ) : null}
      <View style={styles.postContent}>
        <Text style={[styles.postCategory, isDark && styles.textLight]}>
          {post.type === 'event' ? (post.category || 'Event') : (post.locationLabel || 'Nearby')}
        </Text>
        <Text
          style={[styles.postCaption, isDark && styles.textWhite]}
          numberOfLines={2}
        >
          {post.type === 'event' ? post.title : (post.caption || '').substring(0, 80)}
        </Text>
        <View style={styles.postAuthorRow}>
          {post.authorPhoto ? (
            <Image
              source={{ uri: post.authorPhoto }}
              style={styles.authorAvatar}
              contentFit="cover"
            />
          ) : (
            <View style={styles.authorAvatarPlaceholder}>
              <Text style={styles.authorInitial}>{authorInitial}</Text>
            </View>
          )}
          <Text style={[styles.authorName, isDark && styles.textMuted]}>
            {post.authorName || 'Explorer'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Custom marker component for post locations
const PostMarker = React.memo(({ post }) => {
  if (!post.lat || !post.lng) return null;

  return (
    <Marker
      coordinate={{ latitude: post.lat, longitude: post.lng }}
      title={post.type === 'event' ? post.title : (post.caption?.substring(0, 40) || 'Post')}
      description={post.authorName || 'Explorer'}
    >
      <View style={styles.markerContainer}>
        {post.imageURL ? (
          <Image
            source={{ uri: post.imageURL }}
            style={styles.markerImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.markerPlaceholder}>
            <Text style={styles.markerPlaceholderText}>📍</Text>
          </View>
        )}
      </View>
    </Marker>
  );
});

export default function ExploreMap({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const mapTheme = useMapSettingsStore((state) => state.mapTheme);
  const { currentLocation } = useLocationStore();
  const mapConfig = useMemo(() => getMapViewConfig(mapTheme), [mapTheme]);

  // Check/request location permissions
  const locationPermission = useLocationPermission();

  // Watch for location updates
  const watchedLocation = useWatchLocation(true);

  // State
  const [posts, setPosts] = useState([]);
  const [rawPosts, setRawPosts] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radiusIndex, setRadiusIndex] = useState(1); // default 1km
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mapRef = useRef(null);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  // Determine location
  const hasLocationPermission = locationPermission === 'granted';
  let locationError = null;
  let lat, lng;

  if (!hasLocationPermission) {
    locationError = 'Location permission is required to show nearby posts and your location on the map.';
  } else if (!watchedLocation && !currentLocation) {
    locationError = 'Unable to determine your location. Please ensure location services are enabled.';
  } else {
    // useWatchLocation returns the full location object with coords property
    lat = watchedLocation?.coords?.latitude ?? currentLocation?.latitude;
    lng = watchedLocation?.coords?.longitude ?? currentLocation?.longitude;
  }

  const currentRadiusKm = RADIUS_OPTIONS[radiusIndex].value;

  // Map region based on user location
  const region = useMemo(() => {
    if (lat != null && lng != null) {
      // Adjust delta based on radius
      const delta = currentRadiusKm <= 0.5 ? 0.008 : currentRadiusKm <= 1 ? 0.015 : 0.06;
      return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: delta,
        longitudeDelta: delta,
      };
    }
    return DEFAULT_REGION;
  }, [lat, lng, currentRadiusKm]);

  // Toggle bottom sheet
  const toggleSheet = useCallback(() => {
    const toValue = sheetOpen ? 0 : 1;
    Animated.spring(sheetAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
    setSheetOpen(!sheetOpen);
  }, [sheetOpen, sheetAnim]);

  // Subscribe to posts and events when location changes
  useEffect(() => {
    if (!hasLocationPermission || lat == null || lng == null || locationError) {
      setRawPosts([]);
      setRawEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const precision = getGeoHashPrecisionForRadius(currentRadiusKm);
    const geoHashPrefix = encodeGeoHash(lat, lng, precision);

    const unsubPosts = subscribeToPostsNearby(geoHashPrefix, 20, (postsData) => {
      setRawPosts(postsData);
    });

    const unsubEvents = subscribeToEventsNearby(geoHashPrefix, (eventsData) => {
      setRawEvents(eventsData);
    });

    return () => {
      unsubPosts();
      unsubEvents();
    };
  }, [lat, lng, currentRadiusKm, hasLocationPermission, locationError]);

  // Enrich data whenever raw data changes
  useEffect(() => {
    const enrichData = async () => {
      try {
        const typedPosts = rawPosts.map(p => ({ ...p, type: 'post' }));
        const typedEvents = rawEvents.map(e => ({ ...e, type: 'event' }));
        
        const combined = [...typedPosts, ...typedEvents].sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        }).slice(0, 20);

        const enriched = await Promise.all(
          combined.map(async (post) => {
            try {
              const authorId = post.authorId || post.creatorId;
              const author = await getUserProfile(authorId);
              return {
                ...post,
                authorName: author?.displayName || 'Explorer',
                authorPhoto: author?.photoURL || '',
              };
            } catch (e) {
              return { ...post, authorName: 'Explorer', authorPhoto: '' };
            }
          })
        );
        setPosts(enriched);
      } catch (error) {
        console.error('[ExploreMap] Error enriching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    enrichData();
  }, [rawPosts, rawEvents]);

  // Animate map to new region when location or radius changes
  useEffect(() => {
    if (mapRef.current && lat != null && lng != null) {
      mapRef.current.animateToRegion(region, 500);
    }
  }, [region]);

  // Handle radius change
  const handleRadiusChange = useCallback((index) => {
    setRadiusIndex(index);
  }, []);

  // Handle post press
  const handlePostPress = useCallback((postId, type) => {
    if (type === 'event') {
      navigation.navigate('EventDetail', { eventId: postId });
    } else {
      navigation.navigate('PostDetail', { postId });
    }
  }, [navigation]);

  // Handle marker press — open story viewer for posts
  const handleMarkerPress = useCallback((post) => {
    const index = filteredPosts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      navigation.navigate('StoryViewer', {
        posts: filteredPosts,
        initialIndex: index,
      });
    }
  }, [filteredPosts, navigation]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        (p.caption || '').toLowerCase().includes(q) ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.authorName || '').toLowerCase().includes(q) ||
        (p.locationLabel || '').toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  // Bottom sheet translateY interpolation
  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BOTTOM_SHEET_MAX - BOTTOM_SHEET_MIN, 0],
  });

  const renderPostItem = useCallback(({ item }) => (
    <PostCard post={item} onPress={handlePostPress} isDark={isDark} />
  ), [handlePostPress, isDark]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      {/* Google Maps */}
      <MapView
        key={mapTheme}
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        mapType={mapConfig.mapType}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        showsCompass={false}
        customMapStyle={mapConfig.customMapStyle}
        mapPadding={{ top: 70, right: 16, bottom: BOTTOM_SHEET_MIN + 80, left: 16 }}
      >
        {filteredPosts.map((post) => (
          <PostMarker key={post.id} post={post} />
        ))}
      </MapView>

      {/* Top Search Bar */}
      <View style={[styles.searchBarContainer, isDark && styles.searchBarContainerDark]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search GeoConnect..."
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(70,69,84,0.6)'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Radius Selector */}
      <View style={[styles.radiusContainer, isDark && styles.radiusContainerDark]}>
        <View style={styles.radiusHeader}>
          <Text style={[styles.radiusTitle, isDark && styles.textWhite]}>Search Radius</Text>
          <View style={styles.radiusBadge}>
            <Text style={styles.radiusBadgeText}>{RADIUS_OPTIONS[radiusIndex].label}</Text>
          </View>
        </View>
        <View style={styles.radiusButtons}>
          {RADIUS_OPTIONS.map((opt, i) => (
            <TouchableOpacity
              key={opt.label}
              style={[
                styles.radiusButton,
                i === radiusIndex && styles.radiusButtonActive,
                isDark && i !== radiusIndex && styles.radiusButtonDark,
              ]}
              onPress={() => handleRadiusChange(i)}
            >
              <Text
                style={[
                  styles.radiusButtonText,
                  i === radiusIndex && styles.radiusButtonTextActive,
                  isDark && i !== radiusIndex && styles.radiusButtonTextDark,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* My Location Button */}
      <TouchableOpacity
        style={[styles.myLocationButton, isDark && styles.myLocationButtonDark]}
        onPress={() => {
          if (mapRef.current && lat != null && lng != null) {
            mapRef.current.animateToRegion(region, 500);
          }
        }}
      >
        <Text style={styles.myLocationIcon}>📍</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          isDark && styles.bottomSheetDark,
          { transform: [{ translateY: sheetTranslateY }] },
        ]}
      >
        {/* Drag Handle */}
        <TouchableOpacity style={styles.sheetHandle} onPress={toggleSheet}>
          <View style={[styles.sheetHandleBar, isDark && styles.sheetHandleBarDark]} />
        </TouchableOpacity>

        {/* Sheet Header */}
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, isDark && styles.textWhite]}>Nearby Posts</Text>
          <Text style={[styles.sheetCount, isDark && styles.textMuted]}>
            {loading ? 'Loading...' : `${filteredPosts.length} Discovery`}
          </Text>
        </View>

        {/* Posts List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4648d4" />
            <Text style={[styles.loadingText, isDark && styles.textMuted]}>
              Discovering posts...
            </Text>
          </View>
        ) : filteredPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={[styles.emptyText, isDark && styles.textMuted]}>
              {locationError || 'No posts found nearby'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            renderItem={renderPostItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.postsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf8ff',
  },
  containerDark: {
    backgroundColor: '#1b1b23',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Search Bar
  searchBarContainer: {
    position: 'absolute',
    top: 50,
    left: 24,
    right: 24,
    height: 52,
    backgroundColor: 'rgba(252, 248, 255, 0.92)',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1000,
  },
  searchBarContainerDark: {
    backgroundColor: 'rgba(27, 27, 35, 0.92)',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    color: '#1b1b23',
  },
  searchInputDark: {
    color: '#f2effb',
  },

  // Radius Selector
  radiusContainer: {
    position: 'absolute',
    bottom: BOTTOM_SHEET_MIN + 16,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(252, 248, 255, 0.92)',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    zIndex: 999,
    backdropFilter: 'blur(12px)',
  },
  radiusContainerDark: {
    backgroundColor: 'rgba(27, 27, 35, 0.92)',
  },
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  radiusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1b1b23',
  },
  radiusBadge: {
    backgroundColor: 'rgba(70, 72, 212, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  radiusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4648d4',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  radiusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#e4e1ed',
    alignItems: 'center',
  },
  radiusButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  radiusButtonActive: {
    backgroundColor: '#4648d4',
  },
  radiusButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#464554',
  },
  radiusButtonTextDark: {
    color: 'rgba(255,255,255,0.5)',
  },
  radiusButtonTextActive: {
    color: '#ffffff',
  },

  // My Location
  myLocationButton: {
    position: 'absolute',
    right: 24,
    bottom: BOTTOM_SHEET_MIN + 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(252, 248, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 998,
  },
  myLocationButtonDark: {
    backgroundColor: 'rgba(48, 48, 56, 0.95)',
  },
  myLocationIcon: {
    fontSize: 20,
  },

  // Markers
  markerContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2.5,
    borderColor: '#4648d4',
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  markerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
  },
  markerPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
    backgroundColor: '#4648d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPlaceholderText: {
    fontSize: 16,
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_MAX,
    backgroundColor: '#fcf8ff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 1001,
  },
  bottomSheetDark: {
    backgroundColor: '#1b1b23',
  },
  sheetHandle: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  sheetHandleBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(199, 196, 215, 0.4)',
  },
  sheetHandleBarDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1b1b23',
    letterSpacing: -0.3,
  },
  sheetCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#767586',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Posts List
  postsList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  postCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.3)',
  },
  postCardDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  postImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 14,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postContent: {
    flex: 1,
    justifyContent: 'center',
  },
  postCategory: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4648d4',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  postCaption: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1b1b23',
    lineHeight: 20,
    marginBottom: 6,
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  authorAvatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4648d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  authorName: {
    fontSize: 12,
    color: '#767586',
  },

  // Loading & Empty states
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // Text color helpers
  textWhite: {
    color: '#f2effb',
  },
  textLight: {
    color: '#c0c1ff',
  },
  textMuted: {
    color: 'rgba(255,255,255,0.5)',
  },
});