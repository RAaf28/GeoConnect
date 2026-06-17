const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add support for .cjs files
defaultConfig.resolver.sourceExts.push('cjs');

// Disable package exports to allow Firebase to resolve correctly under Metro
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
