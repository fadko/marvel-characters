import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // pole poslednych hladanych vyrazov
    lastSearchTerms: [],
    // pole oblubenych postav
    favoriteCharacters: [],
    /* pole posledneho hladaneho vyrazu vramci session a jeho vysledok,
    viac vysvetlene v SearchCharacters mounted metode */
    sessionLastSearch: {
      term: null,
      result: null
    }
  },
  mutations: {
    addLastSearchTerm(state, term) {
      /* pridavam novy vyraz do pola poslednych hladanych, obmedzil som to
      na 5 vyrazov.. ak sa tam uz dany vyraz nachadza tak ho vymazem a nove
      hladanie dam zase na prvu poziciu v hladaniach.. hladania vzdy po zmene
      aj ulozim do localstorage */
      if (state.lastSearchTerms.includes(term))
        state.lastSearchTerms.splice(state.lastSearchTerms.indexOf(term), 1);

      state.lastSearchTerms.unshift(term);

      if (state.lastSearchTerms.length > 5) state.lastSearchTerms.pop();

      localStorage.setItem(
        "last-search-terms",
        JSON.stringify(state.lastSearchTerms)
      );

      state.sessionLastSearch.term = term;
    },
    loadLocalStorage(state) {
      /* pri spusteni appky kontrolujem ci mam posledne hladane vyrazy a
      oblubene postavy v localstorage a ak ano tak ich vytiahnem a nastavim */
      const savedSearchTerms = localStorage.getItem("last-search-terms");
      const savedFavoriteCharacters = localStorage.getItem(
        "favorite-characters"
      );

      if (savedSearchTerms) {
        state.lastSearchTerms = JSON.parse(savedSearchTerms);
      }

      if (savedFavoriteCharacters) {
        state.favoriteCharacters = JSON.parse(savedFavoriteCharacters);
      }
    },
    toggleFavoriteCharacter(state, character) {
      /* sluzi na pridavanie / odoberanie oblubenej postavy z pola favoriteCharacters,
      commit sa vykonava z FavoriteButton componentu */
      const alreadyInFavorites =
        state.favoriteCharacters.filter(item => item.id === character.id)[0] ||
        null;

      if (alreadyInFavorites) {
        state.favoriteCharacters.splice(
          state.favoriteCharacters.indexOf(alreadyInFavorites),
          1
        );
      } else {
        state.favoriteCharacters.push(character);
      }

      localStorage.setItem(
        "favorite-characters",
        JSON.stringify(state.favoriteCharacters)
      );
    },
    saveSessionLastSearch(state, search) {
      /* tu sa po vyhladavani v SearchCharacters uklada posledny hladany vyraz a
      jeho vysledok */
      state.sessionLastSearch = search;
    }
  }
});
