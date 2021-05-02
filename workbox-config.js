module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{js,html,json}"
  ],
  "swDest": "build/sw.js",
  "runtimeCaching": [{
    "urlPattern": /cdn\.jsdelivr\.net/,
    "handler": 'CacheFirst',
  }],
};
