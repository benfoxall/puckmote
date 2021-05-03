module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
    'src/wasm': "/_wasm",
  },
  buildOptions: {
    baseUrl: '/puckmote/'
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-postcss",
    ["@snowpack/plugin-webpack", {
      // outputPattern: 'xyz.bundle.js',
      // htmlMinifierOptions: false,
      // extendConfig(config) {
      //   config.output.publicPath = '/xyz/blah/'

      //   return config
      // }
    }]
  ],
};
