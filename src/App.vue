<template>
  <div id="app" :style="{ backgroundColor: appBackgroundColor }">
    <div id="app-content">
      <header>
        <nav>
          <router-link to="/">Search</router-link>
          <router-link to="/favorites">Favorites</router-link>
        </nav>
      </header>
      <main>
        <router-view @change-app-bg-color="changeBackgroundColor" />
      </main>
      <footer>
        <p>{{ $appTexts.copyrightInfo }}</p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appBackgroundColor: null
    };
  },
  methods: {
    /* nastavujem farbu backgroundu appky po emite farby z CharacterDetails
    componentu - viac vysvetlene v komente tam */
    changeBackgroundColor(color) {
      if (!color) return;

      const rgba = color.replace("(", "a(").replace(")", ",0.8)");
      this.appBackgroundColor = rgba;
    }
  },
  watch: {
    /* pri zmene routes, ak zrovna idem z CharacterDetails chcem aby sa
    farba backgroundu zmenila na povodnu - ziadnu */
    $route(to, from) {
      if (from.name === "Details") {
        this.appBackgroundColor = null;
      }
    }
  },
  created() {
    /* po vytvoreni appky si v store nasetujem posledne hladane vyrazy
    a oblubene postavy z localstorage (ak tam su ulozene) */
    this.$store.commit("loadLocalStorage");
  }
};
</script>

<style lang="scss" scoped>
#app {
  background-color: $color-primary;
  transition: background-color $transition-time $transition-function;
}

#app-content {
  position: relative;
  z-index: 1;
  max-width: $max-content-width;
  padding: $content-padding-vertical $content-padding-horizontal;
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
}

header,
footer {
  font-size: $font-size-md;
  line-height: $font-size-md;
  @include text-stroke(0.1rem, $color-light);
}

header {
  position: relative;
  z-index: 999;
  text-align: right;

  nav a {
    opacity: 0.8;
    transition: opacity $transition-time $transition-function;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      opacity: 1;
    }

    &:not(:last-child) {
      margin-right: $font-size-md;
    }
  }
}

footer {
  text-align: center;
  margin: auto 0 0;
}

main {
  margin: $content-padding-vertical 0 $content-padding-vertical * 2;
}

@media screen and (max-width: 600px) {
  header nav {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  header,
  footer {
    font-size: $font-size-sm;
    line-height: $font-size-sm;
  }
}
</style>
