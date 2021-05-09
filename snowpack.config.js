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
      htmlMinifierOptions: false,
    }]
  ],
};
