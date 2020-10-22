<template>
  <div
    class="star"
    :class="{
      favorited: $store.state.favoriteCharacters.filter(
        item => item.id === character.id
      ).length
    }"
    @click="$store.commit('toggleFavoriteCharacter', character)"
  >
    <svg viewBox="0 0 183 183" xmlns="http://www.w3.org/2000/svg">
      <path
        class="outer-star"
        d="M91.5 12.9443L108.239 64.461L109.137 67.2249H112.043H166.211L122.388 99.064L120.037 100.772L120.935 103.536L137.674 155.053L93.8511 123.214L91.5 121.506L89.1489 123.214L45.3261 155.053L62.0649 103.536L62.963 100.772L60.6118 99.064L16.7891 67.2249H70.957H73.8631L74.7612 64.461L91.5 12.9443Z"
      />
      <path
        class="inner-star"
        d="M91.5 28.9443L104.647 69.4053L105.545 72.1692H108.451H150.994L116.576 97.1755L114.225 98.8837L115.123 101.648L128.269 142.109L93.8511 117.102L91.5 115.394L89.1489 117.102L54.7307 142.109L67.8772 101.648L68.7753 98.8837L66.4242 97.1755L32.006 72.1692H74.5492H77.4554L78.3534 69.4053L91.5 28.9443Z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    character: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.star {
  cursor: pointer;
  font-family: sans-serif;
  position: absolute;
  z-index: 2;
  top: 1rem;
  right: 1rem;
  font-size: 3.2rem;
  font-weight: 700;
  width: 3.2rem;
  height: 3.2rem;
  opacity: 0;
  transition: opacity $transition-time $transition-function;
  -webkit-tap-highlight-color: transparent;

  &:hover svg {
    transform: scale(1.06);
  }

  svg {
    fill: rgba($color-light, 0.35);
    transform-origin: 50% 50%;
    transition: transform $transition-time $transition-function,
      fill $transition-time $transition-function;

    .inner-star {
      stroke-width: $border-width * 1.2;
      stroke: $color-dark;
    }

    .outer-star {
      stroke-width: $border-width * 2;
      stroke: $color-light;
    }
  }

  &.favorited {
    opacity: 1;

    svg {
      fill: $color-secondary;
    }
  }
}

@media only screen and (max-device-width: 768px) {
  .star {
    opacity: 0.5;
  }
}
</style>
