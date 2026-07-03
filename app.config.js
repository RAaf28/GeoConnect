const fs = require('fs');
const path = require('path');

// Manually load .env variables if they are not defined (needed for EAS CLI builds)
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const separatorIdx = trimmed.indexOf('=');
    if (separatorIdx > 0) {
      const key = trimmed.substring(0, separatorIdx).trim();
      let value = trimmed.substring(separatorIdx + 1).trim();
      // Strip wrapping quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

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