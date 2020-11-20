module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  buildOptions: {
    baseUrl: '/puckmote/'
  },
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-typescript"],
};
