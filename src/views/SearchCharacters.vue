<template>
  <div>
    <div>
      <div id="characters-search-input-wrapper">
        <input
          type="text"
          name="characters-search-input"
          id="characters-search-input"
          ref="charactersSearchInput"
          :placeholder="$appTexts.searchInputPlaceholder"
          autocomplete="off"
          spellcheck="false"
          v-model.trim="searchTerm"
          @keyup.enter="searchForCharacters()"
          @click="$event.target.select()"
        />
      </div>
      <div id="last-searches-container">
        <div
          class="last-search-term"
          v-for="(term, index) in $store.state.lastSearchTerms"
          :key="index"
          @click="lastSearchTermClick(term)"
        >
          <span>{{ term }}</span>
        </div>
      </div>
      <characters-list :characters="searchResult" />
      <transition name="fade">
        <div
          class="centered-info-text"
          v-show="!searchResult.length && alreadySearched && !showSpinner"
        >
          {{ $appTexts.noSearchResult }}
        </div>
      </transition>
    </div>
    <loading-spinner :show="showSpinner" />
  </div>
</template>

<script>
import CharactersList from "@/components/CharactersList.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "Search",
  components: {
    CharactersList,
    LoadingSpinner
  },
  data() {
    return {
      searchTerm: "",
      searchResult: [],
      alreadySearched: false,
      showSpinner: false
    };
  },
  methods: {
    // tu robim request na Marvel API a vyhladavam postavy
    searchForCharacters() {
      /* aby sa nerobili zbytocne requesty tak v tejto podmienke
      kontrolujem ci nie je search input prazdny alebo ci user
      nevyhladava to iste co naposledy (pretoze vysledky posledneho
      hladania su stale zobrazene), ak ano tak zastavim funkciu */
      if (
        !this.searchTerm ||
        this.searchTerm === this.$store.state.sessionLastSearch.term
      )
        return;

      const timestamp = Date.now();
      /* zacnem zobrazovat loading spinner a vysledok podledneho
      hladania (na zaklade ktoreho zobrazujem postavy) nastavim na
      prazdny array aby sa vycistil screen pocas loadingu */
      this.showSpinner = true;
      this.searchResult = [];
      /* tu selectnem search input pre pripad ze by chcel user rovno
      zacat s novym hladanim */
      this.$refs.charactersSearchInput.select();
      /* v store si ulozim posledne hladanie, ktore sa zaroven
      ulozi aj do pola poslednych vyhladavani */
      this.$store.commit("addLastSearchTerm", this.searchTerm);

      /* tu vykonavam samotny request, api keys mam ulozene vo vue
      prototypes, nech ich viem pripadne zmenit na jednom mieste */
      this.$axios
        .get(this.$apiBaseURL, {
          params: {
            nameStartsWith: this.searchTerm,
            limit: 100,
            apikey: this.$apiKeys.public,
            ts: timestamp,
            hash: this.$md5(
              timestamp + this.$apiKeys.private + this.$apiKeys.public
            )
          }
        })
        .then(res => {
          /* v pripade uspesneho requestu tu nastavim novy vysledok
          hladania (pole postav) a zaroven ich zoradim podla poctu
          stories ktore dana postava ma - takto sa hore zobrazuju
          popularnejsie postavy, sortovat to podla mena alebo datumu
          upravy ako to ma priamo Marvel API mi nevyhovovalo :) */
          const heroes = res.data.data.results;
          this.searchResult = heroes.sort(
            (a, b) => b.stories.available - a.stories.available
          );
          console.log(this.searchResult);
          /* alreadySearched pouzivam aby som v pripade ze bude vysledok
          hladania prazdny zobrazil o tom text na obrazovke, defaultne je
          nastaveny na false, aby sa text nezobrazil userovi uz po otvoreni
          appky, na true ho nastavim az po hladani */
          this.alreadySearched = true;
          // prestanem zobrazovat loading
          this.showSpinner = false;
        })
        .catch(() => {
          /* v pripade ze request zlyha tak zobrazim PageNotFound page kde sa
          zobrazuje text o tom ze nebolo mozne ziskat data */
          this.$router.push({ name: "PageNotFound" });
        });
    },
    lastSearchTermClick(term) {
      /* toto sa spusti po kliknuti na predosli hladany vyraz - novy hladany
      vyraz je nastaveny na tento z historie a spusti sa hladanie */
      this.searchTerm = term;
      this.searchForCharacters();
    }
  },
  watch: {
    /* pri zmene vysledku hladania ho v store ukladam tak aby som ho
    mohol pri mountnuti znovu pouzit (vid. koment nizsie) */
    searchResult(value) {
      if (
        value.length &&
        value !== this.$store.state.sessionLastSearch.result
      ) {
        this.$store.commit("saveSessionLastSearch", {
          term: this.searchTerm,
          result: value
        });
      }
    }
  },
  mounted() {
    /* pri mountnuti kontrolujem ci mal user vramci session uz nejaky
    hladany vyraz a vysledok hladania a ak ano tak podla toho nasetujem
    tie aktualne - je to dobre na to aby user nemusel hladat znovu to
    iste ked sa vracia napriklad z detailu postavy naspat na vyhladavanie */
    if (
      this.$store.state.sessionLastSearch.term &&
      this.$store.state.sessionLastSearch.result
    ) {
      this.searchTerm = this.$store.state.sessionLastSearch.term;
      this.searchResult = this.$store.state.sessionLastSearch.result;
    }
  }
};
</script>

<style lang="scss" scoped>
#characters-search-input-wrapper {
  margin-top: -$font-size-md - $content-padding-vertical;
  margin-bottom: $content-padding-vertical / 2;
  text-align: center;
}

#last-searches-container {
  margin: 0 auto $content-padding-vertical;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}

.last-search-term {
  cursor: pointer;
  font-size: $font-size-md;
  text-decoration: none;
  margin: 0.6rem;
  background-color: $color-secondary;
  padding: $border-width $border-width * 2;
  transition: background-color $transition-time $transition-function;
  @include text-stroke(0.1rem, $color-light);

  span {
    display: inline-block;
  }

  &:hover {
    background-color: lighten($color-secondary, 15%);
  }
}
</style>
