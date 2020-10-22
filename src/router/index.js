import Vue from "vue";
import VueRouter from "vue-router";
import SearchCharacters from "../views/SearchCharacters.vue";
import FavoriteCharacters from "../views/FavoriteCharacters.vue";
import CharacterDetails from "../views/CharacterDetails.vue";
import PageNotFound from "../views/PageNotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Search",
    component: SearchCharacters
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: FavoriteCharacters
  },
  {
    path: "/:id",
    name: "Details",
    component: CharacterDetails
  },
  {
    path: "/404",
    alias: "*",
    name: "PageNotFound",
    component: PageNotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
