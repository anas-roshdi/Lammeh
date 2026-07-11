// Load the default Metro configuration
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add the '.db' extension so Metro bundler recognizes our SQLite file
config.resolver.assetExts.push('db');

module.exports = config;