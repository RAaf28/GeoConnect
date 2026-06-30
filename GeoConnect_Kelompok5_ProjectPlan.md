# 📍 GeoConnect — Project Plan Kelompok 5
**Tugas Besar Pemrograman Mobile Lanjut | D-III Ilmu Komputer UPNVJ**
**Fokus: Location-Based Discovery & Geosocial Features**

---

## 🧭 Ringkasan Proyek

GeoConnect adalah social media app berbasis React Native + Expo yang menempatkan **lokasi sebagai core feature**. Pengguna dapat menemukan konten, orang, venue, dan event berdasarkan kedekatan geografis — dengan tetap mengedepankan **privacy by design** sebagai prinsip utama.

| Info | Detail |
|:---|:---|
| Nama App | GeoConnect |
| Kelompok | 5 |
| Anggota | 5 orang |
| Periode | Minggu 13 – 16 (4 minggu) |
| Presentasi | Minggu 16 (bersamaan UAS) |
| Bobot Nilai | 40% dari Total Nilai Akhir |

---

## 👥 Pembagian Role & Tanggung Jawab

Kelompok terdiri dari 5 orang dengan **1 role utama + tanggung jawab fitur unggulan** masing-masing. Setiap anggota tetap memiliki tanggung jawab lintas fungsi (full-stack ringan) agar tidak ada bottleneck.

| # | Role | Tanggung Jawab Utama | Fitur Unggulan yang Dipegang |
|:--|:---|:---|:---|
| A1 | **Tech Lead** | Arsitektur sistem, setup repo & Firebase, code review, integrasi komponen, README teknis | Location Privacy Controls (Fitur 4) |
| A2 | **Frontend Dev 1** | UI/UX screens, navigasi (Stack + Tab + Drawer), animasi & gesture, design system | Location-Based Discovery / Explore Map (Fitur 1) |
| A3 | **Frontend Dev 2** | Map integration (`react-native-maps`), UI komponen khusus geo, dark/light mode | Venue Check-in & Place Discovery (Fitur 2) |
| A4 | **Backend Dev** | Firebase Auth, Firestore schema & security rules, GeoHash/GeoFirestore, API endpoints | Nearby People & Events (Fitur 3) |
| A5 | **QA / DevOps** | Testing, debugging, build APK, dokumentasi teknis, demo video, test report | Koordinasi deliverables + permission flow testing |

> **Catatan:** Setiap orang wajib commit ke GitHub secara mandiri agar commit history mencerminkan kontribusi individual (diawasi dosen untuk deteksi plagiarisme).

---

## 📦 Tech Stack

### Framework & Core
- React Native + Expo (SDK terbaru)
- React Navigation v6: Stack + Tab + Drawer
- Zustand untuk state management global
- Struktur folder: `/src/screens`, `/src/components`, `/src/hooks`, `/src/utils`

### Backend & Data
- Firebase Authentication (Google Sign-In + Email/Password)
- Firebase Firestore (primary database + geospatial query via GeoHash)
- Firebase Storage (foto profil, gambar post, venue photos)
- Minimum 8 API endpoints (CRUD operations)

### Library Geolokasi (Wajib)
- `expo-location` — akses GPS + background location
- `react-native-maps` — semua fitur peta interaktif
- `geofire-common` atau `geofirestore` — GeoHash query di Firestore

### UI & Animation
- React Native Reanimated 2 (min. 3 animasi)
- React Native Gesture Handler (min. 2 gesture)
- `expo-image` untuk optimasi gambar

### Eksternal API
- Google Places API (venue check-in & place data)
- *Alternatif:* Foursquare Places API

---

## 🗓️ Timeline & Sprint Plan

### Minggu 13 — Project Kickoff + Foundation Sprint

#### Sprint Goal
Setup proyek, autentikasi berjalan, struktur navigasi dasar, wireframe Figma selesai.

#### Task per Anggota

**A1 — Tech Lead**
- [ ] Buat GitHub repository publik, setup branch strategy (`main`, `develop`, `feature/*`)
- [ ] Inisiasi project Expo + konfigurasi ESLint & Prettier
- [ ] Setup Firebase project (Auth, Firestore, Storage) + `.env` template
- [ ] Buat arsitektur diagram awal (folder structure + Firebase schema draft)
- [ ] Tulis README awal: instalasi, env setup, cara run

**A2 — Frontend Dev 1**
- [ ] Desain wireframe di Figma: Home/Feed, Explore Map, Profile, Notifications, Settings
- [ ] Setup React Navigation: Bottom Tab (Feed, Explore, Post, Notif, Profile) + Stack per tab
- [ ] Implementasi dark/light mode dengan tema Zustand
- [ ] Komponen dasar: PostCard, Avatar, Button, Badge

**A3 — Frontend Dev 2**
- [ ] Desain wireframe: Venue Detail, Event Discovery, Nearby People, Privacy Settings
- [ ] Setup `react-native-maps` + test MapView dasar di Expo
- [ ] Komponen: MapMarker custom, ClusterMarker placeholder, VenueCard

**A4 — Backend Dev**
- [ ] Implementasi Firebase Auth: Email/Password + Google Sign-In
- [ ] Firestore schema v1: collections `users`, `posts`, `locations`
- [ ] Security rules dasar (authenticated read/write)
- [ ] Custom hook: `useAuth`, `useUser`

**A5 — QA / DevOps**
- [ ] Setup permission flow: `expo-location` request foreground permission
- [ ] Halaman onboarding lokasi: penjelasan kenapa izin lokasi dibutuhkan
- [ ] Test auth flow di physical device Android
- [ ] Catat bugs/issues di GitHub Issues

#### Deliverable Minggu 13
- ✅ GitHub repo publik (link ke dosen)
- ✅ Wireframe Figma (link)
- ✅ Auth flow demo video (1-2 menit): register → login → profil

---

### Minggu 14 — Core Features Sprint + Feature-Specific Sprint

#### Sprint Goal
Fitur sosial dasar berjalan (feed, follow, like, comment). **Minimal 2 dari 4 fitur unggulan** geo selesai (Explore Map + Venue Check-in).

#### Task per Anggota

**A1 — Tech Lead**
- [ ] Review dan merge semua PR dari minggu 13
- [ ] Implementasi **Location Privacy Controls (Fitur 4):**
  - Toggle master lokasi (default OFF)
  - Share location options: Exact / Blurred (±500m) / Hidden
  - Invisible mode (tidak muncul di Nearby People)
  - Location history: simpan & tampilkan riwayat lokasi user
  - Hapus location history (CRUD endpoint)
- [ ] Setup GeoHash di Firestore (`geofire-common`): encode koordinat → GeoHash
- [ ] Dokumentasi arsitektur GeoHash vs GeoFirestore (trade-off)

**A2 — Frontend Dev 1**
- [ ] Implementasi **Explore Map — Location-Based Discovery (Fitur 1):**
  - MapView dengan post markers di area sekitar
  - Filter radius (500m / 1km / 5km / 10km) dengan UI slider
  - Clustering markers (pakai `react-native-map-clustering` atau manual)
  - Tap cluster → bottom sheet list post di area itu
  - Tap marker → preview PostCard mini
- [ ] Feed infinite scroll dengan FlatList teroptimasi
- [ ] Animasi: map zoom in/out smooth, marker appear animation (Reanimated 2)

**A3 — Frontend Dev 2**
- [ ] Implementasi **Venue Check-in & Place Discovery (Fitur 2):**
  - Integrasikan Google Places API: cari venue terdekat
  - Screen VenueDetail: nama, kategori, foto, rating, daftar post
  - Fitur check-in: simpan ke Firestore (`checkins` collection)
  - Leaderboard per venue: user dengan check-in terbanyak
  - Trending places: venue dengan aktivitas terbanyak 7 hari terakhir
- [ ] Komponen: PlaceSearchBar, VenueCard, LeaderboardItem

**A4 — Backend Dev**
- [ ] Post creation dengan tag lokasi: simpan `geoHash`, `lat`, `lng` di dokumen post
- [ ] Firestore query: ambil post dalam radius tertentu pakai GeoHash range query
- [ ] Endpoint follow/unfollow, like, comment
- [ ] Firebase Storage: upload foto post dengan progress indicator
- [ ] Setup push notification (Firebase Cloud Messaging — FCM)

**A5 — QA / DevOps**
- [ ] Test fitur peta di physical device (GPS wajib)
- [ ] Test Google Places API: quota, error handling, fallback
- [ ] Test permission edge cases: user tolak izin lokasi, cabut izin dari settings
- [ ] Progress report: status setiap fitur (Done / In Progress / Blocked)

#### Deliverable Minggu 14
- ✅ Progress report + mid-sprint demo (in-class review)
- ✅ Fitur unggulan checkpoint: Fitur 1 (Explore Map) + Fitur 2 (Venue Check-in) demo

---

### Minggu 15 — Advanced Sprint + Polish & Optimization

#### Sprint Goal
Semua 4 fitur unggulan selesai. UI polish, offline mode, animasi lengkap, APK build, semua dokumentasi finalisasi.

#### Task per Anggota

**A1 — Tech Lead**
- [ ] Finalisasi Location Privacy Controls: blurred location logic (randomize koordinat ±500m)
- [ ] Review semua security rules Firestore: pastikan data lokasi hanya bisa diakses oleh yang berhak
- [ ] Finalisasi architecture diagram (final version)
- [ ] Tulis **Privacy Document (D5-2):** data lokasi apa yang disimpan, berapa lama, cara hapus
- [ ] Tulis **Location Tech Doc (D5-3):** pendekatan GeoHash, library yang digunakan, trade-off presisi vs privasi

**A2 — Frontend Dev 1**
- [ ] Finalisasi Explore Map: polish UI, loading skeleton saat fetch post
- [ ] Implementasi 3 animasi Reanimated 2:
  - Marker pulse animation (post baru muncul)
  - Map filter panel slide-up (bottom sheet)
  - Transition Feed → Map dengan shared element (opsional, jika waktu cukup)
- [ ] Implementasi 2 gesture handler:
  - Pinch-to-zoom map (native maps sudah handle, dokumentasikan)
  - Swipe down dismiss bottom sheet
- [ ] Offline mode: tampilkan post ter-cache (Zustand persist / AsyncStorage) saat offline

**A3 — Frontend Dev 2**
- [ ] Implementasi **Nearby People & Events (Fitur 3):**
  - Nearby People: list akun publik yang pernah posting di area ≤ radius pilihan
  - Create Event: form (judul, deskripsi, tanggal, lokasi pin di map)
  - Event Discovery: peta event publik dalam radius tertentu
  - RSVP event: Going / Interested / Not Going
  - Event Story: story 24 jam untuk event aktif
- [ ] UI polish: konsistensi spacing, typography, warna antar screen
- [ ] Dark mode: pastikan semua screen mendukung

**A4 — Backend Dev**
- [ ] Firestore schema final: `users`, `posts`, `checkins`, `events`, `rsvp`, `locationHistory`
- [ ] Finalisasi security rules: rules berbeda untuk data lokasi exact vs blurred
- [ ] Background location handling dengan `expo-location` (TaskManager) — efisien, tidak drain baterai
- [ ] Notifikasi: "Ada event baru di sekitar kamu" via FCM
- [ ] Minimum 8 endpoint terdokumentasi (CRUD semua fitur)

**A5 — QA / DevOps**
- [ ] Tulis test report: daftar test case, hasil (pass/fail), bugs ditemukan & diperbaiki
- [ ] Build APK dengan `eas build` (Expo Application Services)
- [ ] Rekam **Map Demo Video (D5-4):** durasi 4 menit, mencakup:
  1. Explore Map (filter radius, clustering, tap post)
  2. Venue Check-in (cari venue, check-in, lihat leaderboard)
  3. Nearby People & Events (discovery, buat event, RSVP)
  4. Privacy Settings (toggle lokasi, invisible mode, hapus history)
- [ ] Finalisasi README: instalasi, env setup, screenshot semua fitur utama

#### Deliverable Minggu 15 (Deadline: Jumat Minggu 15, 23:59 WIB)
- ✅ Feature complete demo build
- ✅ Test report
- ✅ **Semua deliverable submit via GitHub + LMS LEADS**

---

### Minggu 16 — Final Presentation + UAS

#### Persiapan Presentasi

**A2 + A3** — Susun slide PPT (maks. 15 slide):

| Slide | Konten |
|:--|:---|
| 1 | Cover: GeoConnect, nama kelompok, anggota |
| 2 | Problem Statement: kenapa location-based social? |
| 3 | Solusi & fitur overview (4 fitur unggulan) |
| 4 | Tech Stack & arsitektur sistem |
| 5 | Firestore Schema + GeoHash approach |
| 6 | Demo: Explore Map |
| 7 | Demo: Venue Check-in & Place Discovery |
| 8 | Demo: Nearby People & Events |
| 9 | Demo: Location Privacy Controls |
| 10 | Animasi & Gesture yang diimplementasikan |
| 11 | Privacy Document highlight |
| 12 | Challenges & Trade-offs (presisi vs privasi) |
| 13 | Test Report & QA summary |
| 14 | Bonus yang dicapai (jika ada) |
| 15 | Kesimpulan + Q&A |

**A1** — Siapkan jawaban teknis mendalam untuk pertanyaan dosen:
- Bagaimana GeoHash bekerja di Firestore?
- Kenapa memilih GeoHash vs GeoFirestore?
- Bagaimana implementasi blurred location?
- Apa saja Firestore security rules untuk data lokasi?

**A4** — Siapkan live demo di physical device (GPS aktif)

**A5** — Backup: pastikan APK ter-install di 2 device, Expo Go link ready sebagai fallback

---

## 📋 Checklist Deliverables

### Deliverables Wajib Semua Kelompok

| # | Deliverable | PIC | Status |
|:--|:---|:---|:---|
| 1 | Source Code GitHub (repo publik, commit history merata) | A1 | ⬜ |
| 2 | README.md (instalasi, .env, cara run, screenshot) | A1, A5 | ⬜ |
| 3 | Technical Documentation (architecture diagram, Firestore schema, API docs) | A1, A4 | ⬜ |
| 4 | User Manual (panduan non-teknis + screenshot) | A5 | ⬜ |
| 5 | APK Build / Expo Go Link | A5 | ⬜ |
| 6 | Screen Recording Demo (3-4 menit, semua fitur utama) | A5 | ⬜ |
| 7 | Presentasi Slides (maks. 15 slide) | A2, A3 | ⬜ |

### Deliverables Spesifik Kelompok 5

| Kode | Deliverable | PIC | Status |
|:--|:---|:---|:---|
| D5-1 | Source Code + GitHub (setup instruction detail) | A1 | ⬜ |
| D5-2 | Privacy Document (data lokasi: apa, berapa lama, cara hapus) | A1 | ⬜ |
| D5-3 | Location Tech Doc (pendekatan geospatial query + library) | A1, A4 | ⬜ |
| D5-4 | Map Demo Video (4 menit: peta, check-in, nearby, event) | A5 | ⬜ |
| D5-5 | Presentasi PPT (maks. 15 slide) | A2, A3 | ⬜ |
| D5-6 | APK/Expo Link (wajib test di physical device GPS) | A5 | ⬜ |

---

## 🏆 Kriteria Penilaian & Target Nilai

### Target: Sangat Baik (90–100) di semua kriteria

| Kriteria | Bobot | Target | Cara Mencapai |
|:---|:--|:---|:---|
| **Functionality** | 30% | 90–100 | Semua 4 fitur unggulan berjalan tanpa bug, edge case ter-handle (izin ditolak, GPS mati, offline) |
| **Code Quality** | 25% | 90–100 | Struktur folder rapi, naming konsisten, komponen reusable, JSDoc pada fungsi utama |
| **Fitur Unggulan** | 20% | 90–100 | Semua 4 fitur selesai: Explore Map, Venue Check-in, Nearby People & Events, Privacy Controls |
| **UI/UX & Animasi** | 15% | 80–89 | Min. 3 animasi Reanimated 2, 2 gesture, dark mode, map UI bersih dan intuitif |
| **Presentasi** | 10% | 90–100 | Demo lancar di physical device, tiap anggota bisa jelaskan bagiannya |

### Bonus Poin yang Realistis Dikejar (+5 masing-masing)
- [ ] **JSDoc** untuk fungsi dan komponen utama (A1 enforcement via code review)
- [ ] **CI/CD GitHub Actions** — auto lint + test saat push ke main (A5)
- [ ] **Accessibility features** — font scaling, screen reader hint pada map (A2)

---

## 🗃️ Firestore Schema (Draft)

```
/users/{userId}
  - displayName, photoURL, bio
  - locationPrivacy: { mode: "exact"|"blurred"|"hidden", invisibleMode: bool }
  - followersCount, followingCount

/posts/{postId}
  - authorId, caption, imageURL, createdAt
  - geoHash (string), lat (number), lng (number)   ← untuk geospatial query
  - likesCount, commentsCount
  - locationLabel (opsional: nama tempat)

/checkins/{checkinId}
  - userId, venueId, venueName, lat, lng, createdAt

/events/{eventId}
  - creatorId, title, description, startDate, endDate
  - geoHash, lat, lng, locationLabel
  - rsvpCounts: { going, interested }

/rsvp/{eventId_userId}
  - userId, eventId, status: "going"|"interested"|"not_going"

/locationHistory/{userId}/entries/{entryId}
  - lat, lng, geoHash, timestamp
  - (auto-delete setelah 30 hari via Cloud Functions / client-side cleanup)
```

---

## ⚠️ Tech Constraints Checklist (Wajib Dipenuhi)

- [ ] `react-native-maps` digunakan untuk **semua** fitur peta
- [ ] Geospatial query menggunakan **GeoHash** (via `geofire-common`) atau GeoFirestore
- [ ] Permission flow lengkap: request → denied → guide ke settings → graceful degradation
- [ ] Background location dengan `expo-location` TaskManager — tidak drain baterai
- [ ] **Privacy by Design:** default SEMUA fitur lokasi adalah **OFF** saat pertama login
- [ ] Dokumentasi trade-off presisi lokasi vs privasi (masuk D5-3)

---

## 📐 Struktur Folder

```
/src
  /screens
    /auth          → LoginScreen, RegisterScreen
    /feed          → FeedScreen, PostDetailScreen
    /explore       → ExploreMapScreen, FilterPanel
    /venue         → VenueDetailScreen, CheckinScreen, LeaderboardScreen
    /events        → EventDiscoveryScreen, CreateEventScreen, EventDetailScreen
    /nearby        → NearbyPeopleScreen
    /profile       → ProfileScreen, EditProfileScreen
    /privacy       → PrivacySettingsScreen, LocationHistoryScreen
    /notifications → NotificationScreen
  /components
    /map           → MapMarker, ClusterMarker, RadiusCircle
    /post          → PostCard, PostGrid
    /venue         → VenueCard, PlaceSearchBar
    /event         → EventCard, RSVPButton
    /shared        → Avatar, Button, Badge, BottomSheet, Skeleton
  /hooks
    → useAuth, useLocation, useGeoQuery, useNearbyPosts, useVenue, useEvents
  /utils
    → geoHashUtils.js, locationPrivacy.js, formatDistance.js
  /store
    → authStore.js, locationStore.js, feedStore.js (Zustand)
  /services
    → firestore.js, storage.js, placesAPI.js, notifications.js
```

---

## 🔗 Link & Resources

| Resource | Link |
|:---|:---|
| GitHub Repo | _[isi setelah dibuat]_ |
| Figma Wireframe | _[isi setelah dibuat]_ |
| Firebase Console | _[isi setelah dibuat]_ |
| Google Cloud Console (Places API) | _[isi setelah dibuat]_ |
| `geofire-common` docs | https://github.com/firebase/geofire-js |
| `react-native-maps` docs | https://github.com/react-native-maps/react-native-maps |
| `expo-location` docs | https://docs.expo.dev/versions/latest/sdk/location/ |
| GeoHash explainer | https://www.pubnub.com/learn/glossary/what-is-geohashing/ |

---

*Dokumen ini adalah living document — update status checklist setiap akhir sprint.*
*Last updated: Minggu 13*
