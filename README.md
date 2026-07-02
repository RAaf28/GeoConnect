# GeoConnect

GeoConnect is a location-aware mobile application built with Expo SDK 54, Firebase (Authentication, Firestore, Storage), and Google Maps.

## 1. Environment Variables

Create a `.env` file in the root directory (copied from `.env.example`) and configure the following variables:

```env
# Firebase Client Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google Maps / Places API Key (must be set in .env)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App Configuration
EXPO_PUBLIC_GEOHASH_PRECISION=9
EXPO_PUBLIC_DEFAULT_LOCATION_RADIUS_METERS=1000
```

---

## 2. Running the Project

### Installation
```bash
npm install
```

### Starting the Development Server
```bash
npm start
# or npx expo start
```
* Scan the QR code using the **Expo Go** app on your physical device, or run it on iOS/Android emulators via Expo CLI options.

---

## 3. Firebase Setup Notes

To ensure the backend functions correctly with client-side operations:

### Security Rules
- **Firestore Rules**: Deploy the rules defined in [firestore.rules](file:///c:/Users/NFNM/Desktop/kuliah/Semester%204/Mobile%20lanjut/UAS-dev/firestore.rules) to your Firebase project.
- **Storage Rules**: Deploy the rules defined in [storage.rules](file:///c:/Users/NFNM/Desktop/kuliah/Semester%204/Mobile%20lanjut/UAS-dev/storage.rules) to your Firebase Storage bucket.

### Indexes
- **Firestore Indexes**: Ensure composite indexes defined in [firestore.indexes.json](file:///c:/Users/NFNM/Desktop/kuliah/Semester%204/Mobile%20lanjut/UAS-dev/firestore.indexes.json) are created in your Firestore database.
- You can deploy rules and indexes using the Firebase CLI:
  ```bash
  firebase deploy --only firestore:rules,firestore:indexes,storage
  ```

---

## 4. Google Maps API Key Restriction Reminder

The Google Maps API key is injected dynamically into Android and iOS configurations.
* **Important**: To protect your API key from unauthorized usage, configure **API Restrictions** in the Google Cloud Console.
* Restrict the key's usage to:
  - **Android apps**: Package name `com.geoconnect.app` (and specify your development SHA-1 fingerprint).
  - **iOS apps**: Bundle ID `com.geoconnect.app`.

---

## 5. Location Permission Notes

* **No Background Location Tracking**: The background location permission (`ACCESS_BACKGROUND_LOCATION`) has been removed from Android configurations. The app does not actively monitor or record user locations in the background.
* **Required Foreground Permissions**: The app requires foreground location permission (`ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`) only. This is requested when using the interactive map, post/event tagging, and checking in.
* **Privacy by Design**: Default location sharing privacy mode is set to "hidden". Location tracking is only active while the app is in use and if explicitly permitted by the user.

---

## 6. Google Sign-In Setup (Optional)

Google Sign-In is disabled in the default dev client unless OAuth Client IDs are configured. To enable it:
1. Create OAuth client IDs for Android and iOS in Google Cloud Console.
2. Link them in Firebase Console -> Authentication -> Sign-in methods -> Google.
3. Update `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) in the project.
4. Run `npx expo prebuild` to regenerate native projects and build via Xcode/Android Studio.

---

## 7. Static Validation & Code Verification Checks

To maintain code quality and prevent deployment errors, the following sanity checks are configured:

### Environment Variable Validation
Verify that all required environment variables are set in your local `.env` file (checks for missing keys and outputs warnings for placeholder values):
```bash
npm run validate-env
```

### Code Quality & Linter Checks
Run the linter check over the source folder to inspect for syntax errors, undefined variables, and unused declarations:
```bash
npm run lint
```

### Expo Native Configuration Sanity Checks
Ensure the Expo app configuration correctly builds, dynamic variables load from the `.env` file, and target native permissions match actual code patterns:
```bash
npx expo config
```