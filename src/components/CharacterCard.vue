<template>
  <div
    class="character-card-container"
    ref="cardContainer"
    :style="{
      height: containerHeight + 'rem',
      opacity: imageLoaded ? 1 : 0,
      transform: `rotate(${randomRotation}deg)`
    }"
  >
    <h2>{{ character.name }}</h2>
    <a :href="`/${character.id}`" @click.prevent="goToDetailsPage">
      <img
        @load="imageLoaded = true"
        :src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
        :alt="character.name"
      />
    </a>
    <favorite-button :character="character" />
  </div>
</template>

<script>
import FavoriteButton from "@/components/FavoriteButton.vue";

export default {
  components: {
    FavoriteButton
  },
  data() {
    return {
      containerHeight: 0,
      imageLoaded: false
    };
  },
  props: {
    character: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    randomRotation() {
      return Math.random() * 3 - 1.5;
    }
  },
  methods: {
    setContainerHeight() {
      this.containerHeight = this.$refs.cardContainer.offsetWidth / 10;
    },
    /* tu idem na details view, kde do params posielam character z ktoreho
    sa tam preklikavam - viac info v komente componentu CharacterDetails */
    goToDetailsPage() {
      this.$router.push({
        name: "Details",
        params: { id: this.character.id, character: this.character }
      });
    }
  },
  mounted() {
    this.setContainerHeight();
    window.addEventListener("resize", this.setContainerHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setContainerHeight);
  }
};
</script>

<style lang="scss" scoped>
.character-card-container {
  position: relative;
  transition: opacity $transition-time $transition-function;
  overflow: hidden;
  border: $border-width solid $color-light;

  h2 {
    position: absolute;
    z-index: 2;
    bottom: 0.5rem;
    left: 1rem;
    font-size: $font-size-lg;
    @include text-stroke(0.2rem, $color-light);
  }

  img {
    cursor: pointer;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(1.01);
    transition: transform $transition-time $transition-function;
  }

  &:hover {
    .star {
      opacity: 1;
    }

    img {
      transform: scale(1.05) rotate(1deg);
    }
  }
}
</style>
