<template>
  <div class="cards-container">
    <character-card
      v-for="(character, index) in characters"
      :key="index"
      :character="character"
    />
  </div>
</template>

<script>
import CharacterCard from "@/components/CharacterCard.vue";

export default {
  components: {
    CharacterCard
  },
  props: {
    characters: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2vw 2vw;
}

@media screen and (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 3vw 3vw;
  }
}

@media screen and (max-width: 400px) {
  .cards-container {
    grid-template-columns: 1fr;
    gap: 4vw;
  }
}
</style>
