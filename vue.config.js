module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Marvel Characters";
      return args;
    });
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/base.scss";`
      }
    }
  }
};
