const config = require('./app.json');

const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!googleMapsApiKey) {
  throw new Error('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY must be set in .env file');
}

// Inject the Google Maps API key into the iOS and Android config
config.expo.ios.config.googleMapsApiKey = googleMapsApiKey;

// Ensure android.config.googleMaps exists and set apiKey
config.expo.android.config.googleMaps = {
  ...(config.expo.android.config.googleMaps || {}),
  apiKey: googleMapsApiKey,
};

module.exports = config;