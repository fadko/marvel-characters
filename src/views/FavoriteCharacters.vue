<template>
  <div>
    <characters-list :characters="characters" />
    <transition name="fade">
      <div class="centered-info-text" v-show="!characters.length">
        {{ $appTexts.noFavorites }}
      </div>
    </transition>
  </div>
</template>

<script>
import CharactersList from "@/components/CharactersList.vue";

export default {
  name: "Favorites",
  components: {
    CharactersList
  },
  computed: {
    characters() {
      return this.$store.state.favoriteCharacters;
    }
  }
};
</script>
