<template>
  <div>
    <transition name="fade">
      <div
        v-if="character"
        v-show="!contentLoading"
        class="character-details-container"
        :style="{
          borderColor: imageColors[1],
          transform: `rotate(${randomRotation}deg)`
        }"
      >
        <favorite-button :character="character" />
        <img
          class="character-image"
          ref="characterImage"
          crossorigin="anonymous"
          :src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
          :alt="character.name || ''"
        />
        <div
          class="character-image-gradient"
          :style="{
            background: imageColors
              ? `linear-gradient(to top, ${imageColors[0]}, transparent)`
              : 'none'
          }"
        ></div>
        <div
          class="character-info"
          :style="{ transform: `rotate(-${randomRotation}deg)` }"
        >
          <h1 class="character-header">{{ character.name }}</h1>
          <p class="character-about">
            {{ character.description || $appTexts.noDescription }}
          </p>
        </div>
      </div>
    </transition>
    <loading-spinner :show="contentLoading" />
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import FavoriteButton from "@/components/FavoriteButton.vue";
import ColorThief from "colorthief";

export default {
  name: "Details",
  components: {
    LoadingSpinner,
    FavoriteButton
  },
  data() {
    return {
      character: null,
      imageColors: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
      contentLoading: true
    };
  },
  computed: {
    randomRotation() {
      return Math.random() * 1.5 - 0.75;
    }
  },
  methods: {
    /* tu nic podstatne, len som to chcel trochu vizualne ozivit
    a tak z obrazku postavy cez package ColorThief najdem dve najvyraznejsie
    farby, ked sa ich hodnota zmeni tak vo watch si potom cez emit jednu
    poslem do App componentu nech sa podla nej nastavi background
    a druhu tu pouzijem na farbu borderu */
    setImageColors() {
      setTimeout(() => {
        const colorThief = new ColorThief();
        const img = this.$refs.characterImage;

        if (img.complete) {
          this.imageColors = colorThief
            .getPalette(img, 2)
            .map(color => `rgb(${color.join(",")})`);
        } else {
          img.addEventListener("load", () => {
            this.imageColors = colorThief
              .getPalette(img, 2)
              .map(color => `rgb(${color.join(",")})`);
          });
        }
      }, 0);
    }
  },
  watch: {
    imageColors(value) {
      if (value) {
        this.contentLoading = false;
        this.$emit("change-app-bg-color", value[0]);
      }
    }
  },
  created() {
    /* tu sledujem ci mam v route parametroch ulozeny objekt postavy -
    ten si ukladam po prekliku z CharacterCard componentu (konkretne
    z jeho metody goToDetailsPage) - ak ho tam mam tak tu nastavim
    character na tuto hodnotu a ukoncim funkciu, nemusim teda robit
    dalsi request na API lebo character mam ulozeny uz z requestu zo
    SearchCharacters.. ak ho tam vsak nemam (napriklad user zada route
    k postave priamo do prehliadaca) tak request vykonam */
    if (this.$route.params.character) {
      this.character = this.$route.params.character;
      this.setImageColors();
      return;
    }

    // ID taham z parametrov v URL
    const id = this.$route.params.id;
    const timestamp = Date.now();

    this.$axios
      .get(`${this.$apiBaseURL}/${id}`, {
        params: {
          apikey: this.$apiKeys.public,
          ts: timestamp,
          hash: this.$md5(
            timestamp + this.$apiKeys.private + this.$apiKeys.public
          )
        }
      })
      .then(res => {
        this.character = res.data.data.results[0];
        this.setImageColors();
      })
      .catch(() => {
        /* rovnako ako aj v SearchCharacters, ak request zlyha
        presmerovavam na PageNotFound page */
        this.$router.push({ name: "PageNotFound" });
      });
  }
};
</script>

<style lang="scss" scoped>
.character-details-container {
  position: relative;
  border: $border-width solid $color-light;
  padding: $content-padding-vertical $content-padding-horizontal;
  min-height: calc(100vh - 19rem);
  display: flex;
  flex-flow: column nowrap;

  &:hover {
    .star {
      opacity: 1;
    }
  }
}

.character-image,
.character-image-gradient {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.character-info {
  margin-top: auto;
}

.character-header {
  margin-bottom: $content-padding-vertical / 2;
  font-size: $font-size-xl;
  @include text-stroke(0.2rem, $color-light);
}

.character-about {
  width: 30%;
  min-width: 20rem;
  font-size: $font-size-md;
  @include text-stroke(0.1rem, $color-light);
}
</style>
