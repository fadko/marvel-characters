import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import md5 from "md5";
import "./assets/scss/base.scss";

Vue.config.productionTip = false;

/* tu si do prototype objektu ukladam importy a nejake konstanty vratane
textov, nech ich viem potom globalne pouzivat v appke */
Vue.prototype.$axios = axios;
Vue.prototype.$md5 = md5;
Vue.prototype.$apiBaseURL = "https://gateway.marvel.com/v1/public/characters";
Vue.prototype.$apiKeys = {
  public: "532b5106eb1adce237534b8fe0c92d0c",
  private: "37c2ce17ceb59752f77ef80835031cfe8e9b6ef4"
};
Vue.prototype.$appTexts = {
  badRequest: "Page not found or error getting data",
  noSearchResult: "No search result",
  noFavorites: "No favorite characters",
  noDescription: "There is no description of this character",
  searchInputPlaceholder: "Search characters",
  copyrightInfo: "Data provided by Marvel. © 2014 Marvel"
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
