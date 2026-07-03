# GeoConnect — System Architecture & Component Diagram

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      React Native App                         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         React Navigation (v6)                            │  │
│  │  ├─ Stack (Auth: Login/Register)                        │  │
│  │  ├─ Tab (Feed | Explore | Profile | Notifications)     │  │
│  │  └─ Drawer (Settings, Privacy, About)                  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         Zustand Global State                             │  │
│  │  ├─ AuthStore (user, loading, error)                   │  │
│  │  ├─ LocationStore (currentLocation, permission)        │  │
│  │  ├─ FeedStore (posts, loading)                         │  │
│  │  ├─ ThemeStore (isDark)                                │  │
│  │  └─ PrivacyStore (locationPrivacy)                     │  │
│  └─────────────────────────────────────────────────────────┘  │
│           ▼                          ▼              ▼           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │  Custom Hooks    │  │  Services Layer  │  │   Utils     │  │
│  ├─ useAuth        │  ├─ authService    │  ├─ geoUtils   │  │
│  ├─ useLocation    │  ├─ firestore      │  └─ formatting │  │
│  ├─ useGeoQuery    │  └─ placesAPI      │                 │  │
│  └─ useTheme       │                     │                 │  │
│                     │                     │                 │  │
│  Fetch data from   │  Communicate       │  Format &      │  │
│  state & services  │  w/ backends       │  transform     │  │
└────────────────────┴─────────────────────┴──────────────────┘  │
        ▼                   ▼                                     │
   Render UI        Remote/Local Data                            │
                                                                 │
└──────────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│              External Services & APIs                         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────┐  ┌──────────────────────┐             │
│  │   Firebase         │  │   Google APIs        │             │
│  ├─ Auth             │  ├─ Places (venues)    │             │
│  ├─ Firestore (GeoHash)    │  └─ Maps             │             │
│  ├─ Storage (photos) │                          │             │
│  └─ Cloud Messaging  │                          │             │
│                      │                          │             │
│  Location DB:        │  Venue Data:            │             │
│  users, posts,       │  Place info, ratings    │             │
│  events, checkins    │                          │             │
└────────────────────┴──────────────────────────┘             │
                                                                 │
│  ┌────────────────────┐  ┌──────────────────────┐             │
│  │   Device APIs      │  │   AsyncStorage       │             │
│  ├─ expo-location    │  │  (Offline cache)    │             │
│  ├─ Permissions      │  │                      │             │
│  ├─ Camera           │  │  Persist:            │             │
│  └─ Photo Library    │  │  - Auth tokens       │             │
│                      │  │  - Theme preference  │             │
│                      │  │  - Location history  │             │
│                      │  └─────────────────────┘             │
│                                                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Location Privacy (Fitur 4 — A1)

```
User Opens PrivacySettingsScreen
         ▼
1. Load Privacy Settings
   └─ getLocationPrivacy(userId)
      └─ Firestore: users/{userId}.locationPrivacy
         └─ Update PrivacyStore
            └─ UI Re-renders

User Selects Privacy Mode
         ▼
2. Update Privacy Mode
   └─ updatePrivacyMode() (Zustand)
   └─ updateLocationPrivacy(userId, mode)
      └─ Firestore: users/{userId} update
         └─ SecurityRules validate auth

On New Post Creation
         ▼
3. Apply Privacy Logic
   ├─ If mode === "exact"
   │  └─ Store: lat, lng (exact), geoHash(exact)
   ├─ If mode === "blurred"
   │  └─ blurLocation(lat, lng)
   │     └─ Randomize ±500m
   │     └─ Calculate new geoHash
   │     └─ Store: blurred lat/lng/geoHash
   └─ If mode === "hidden"
      └─ Skip location tag entirely

Other Users Query Nearby Posts
         ▼
4. Security Rules Check
   ├─ Read post
   ├─ If author.locationPrivacy.mode === "hidden"
   │  └─ Deny read
   └─ Else
      └─ Allow read

```

---

## Component Hierarchy: Privacy Controls

```
App.js
└─ NavigationContainer
   └─ RootNavigator
      └─ AppStack (authenticated)
         └─ Stack.Screen "Privacy"
            └─ PrivacySettingsScreen
               ├─ SafeAreaView
               └─ ScrollView
                  ├─ Header
                  │  ├─ Title: "Location Privacy Controls"
                  │  └─ Subtitle
                  │
                  ├─ Privacy Mode Section
                  │  ├─ ModeCard (Hidden)
                  │  │  ├─ ModeHeader (name + checkmark)
                  │  │  └─ ModeDescription
                  │  ├─ ModeCard (Blurred)
                  │  └─ ModeCard (Exact)
                  │
                  ├─ Invisible Mode Section
                  │  ├─ ToggleLabel
                  │  └─ Switch
                  │
                  ├─ Location History Section
                  │  ├─ HistoryInfo
                  │  └─ DeleteButton
                  │
                  └─ Privacy Info Section
                     └─ InfoText (explanations)
```

---

## Geospatial Query Flow

```
User opens ExploreMapScreen
         ▼
1. Get Current Location
   └─ useCurrentLocation()
      └─ expo-location.getCurrentPositionAsync()
         └─ lat, lng (from GPS)

2. Encode GeoHash
   └─ encodeGeoHash(lat, lng, 9)
      └─ geofire-common.calculateHash()
         └─ geoHash: "9q8yy9kzz" (example)

3. Query Nearby Posts
   └─ Firestore query:
      where('geoHash', '>=', geoHash)
      where('geoHash', '<', geoHash + 'z')
      └─ Returns all posts in same geohash bucket (≈4.9km)

4. Calculate Distances
   └─ calculateDistance(userLat, userLng, postLat, postLng)
      └─ Haversine formula
         └─ Filter by selected radius (500m - 10km)

5. Render Map
   └─ React Native Maps
      ├─ MapView (centered on user)
      ├─ Markers for each post (within radius)
      ├─ Clustering (if >50 markers)
      └─ RadiusCircle overlay
```

---

## Firestore Collection Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    Firestore Structure                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /users/{userId}  ◄────────────┐                            │
│  ├─ displayName                 │                            │
│  ├─ email                       │                            │
│  ├─ locationPrivacy ◄──────┐   │                            │
│  │  ├─ mode                │   │                            │
│  │  └─ invisibleMode       │   │                            │
│  └─ followersCount          │   │                            │
│                             │   │                            │
│  /posts/{postId}           │   │                            │
│  ├─ authorId ─────────────────┤ (Reference)               │
│  ├─ caption                    │                            │
│  ├─ geoHash                    │ ◄── Used for queries     │
│  ├─ lat, lng                   │                            │
│  └─ createdAt                  │                            │
│                             │   │                            │
│  /checkins/{checkinId}      │   │                            │
│  ├─ userId ───────────────────┘   (Reference)             │
│  ├─ venueId                          (Google Places)       │
│  ├─ lat, lng                                               │
│  └─ createdAt                                              │
│                                                              │
│  /events/{eventId}                                          │
│  ├─ creatorId                                              │
│  ├─ title                                                  │
│  ├─ geoHash                                                │
│  ├─ rsvpCounts                                             │
│  └─ startDate                                              │
│                                                              │
│  /locationHistory/{userId}/entries/{entryId}              │
│  ├─ lat, lng, geoHash          (User's location history) │
│  └─ timestamp                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
LoginScreen / RegisterScreen
         ▼
authService.createAccount(email, password, displayName)
         or
authService.signInWithEmail(email, password)
         or
authService.signInWithGoogle()
         ▼
Firebase Auth (create user + JWT token)
         ▼
onAuthChange() listener triggered
         ▼
useAuth hook:
  ├─ Get current user UID
  ├─ Fetch user profile from Firestore
  └─ Update AuthStore (user + profile data)
         ▼
Navigation switches from AuthStack → AppStack
         ▼
User sees Feed/Map (authenticated routes)
```

---

## Privacy-First Design Pattern

```
Feature: New Post Creation

Step 1: Check User's Privacy Setting
        └─ privacyStore.locationPrivacy.mode

Step 2: Apply Location Processing
        ├─ If "hidden"
        │  └─ Omit location tag
        ├─ If "blurred"
        │  └─ geoUtils.blurLocation(lat, lng)
        │     ├─ Randomize ±500m
        │     └─ Encode blurred geoHash
        └─ If "exact"
           └─ Use exact coordinates
           └─ Encode exact geoHash

Step 3: Create Post in Firestore
        └─ Save with applied location processing

Step 4: Other Users Read Post
        └─ Firestore Security Rules
           ├─ Check author's locationPrivacy.mode
           ├─ If "hidden" → Deny
           └─ Else → Allow
```

---

## Animation & Gesture Checklist (Minggu 15 Target)

### Required: 3 Animations (Reanimated 2)

- [ ] Marker pulse on new post arrival (ExploreMapScreen)
- [ ] Bottom sheet slide-up on filter panel (ExploreMapScreen)
- [ ] Transition from map to post detail (optional shared element)

### Required: 2 Gestures (Gesture Handler)

- [ ] Pinch-to-zoom map (native, documented)
- [ ] Swipe-down dismiss bottom sheet

---

## Security Checklist (A1 Responsibility)

- [ ] Environment variables never hardcoded
- [ ] Firestore security rules restrict unauthorized access
- [ ] Location data only accessible by user + authorized recipients
- [ ] Auth tokens stored securely (AsyncStorage with jailbreak detection)
- [ ] No credentials logged in console
- [ ] Input validation at API boundaries
- [ ] Error messages don't expose internals

---

## Performance Metrics (Target)

| Metric                  | Target           |
| :---------------------- | :--------------- |
| App startup time        | < 3s             |
| Map load + markers      | < 2s             |
| Geospatial query        | < 1s (Firestore) |
| Image load (expo-image) | < 1s (cached)    |
| Animation 60 FPS        | ✓ Reanimated 2   |

---

**Architecture Last Updated:** Minggu 13 (Kickoff)  
**Next Review:** Minggu 14 (Post-Sprint Integration)
