<template>
  <div id="spinner" v-show="show"></div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
#spinner {
  width: $spinner-size;
  height: $spinner-size;
  position: fixed;
  z-index: 999;
  top: 50%;
  left: 50%;
  background: linear-gradient(to right, $color-secondary, $color-primary);
  border-radius: 50%;
  animation: loadingSpin 1s linear infinite;

  &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: $spinner-size - $border-width * 2;
    height: $spinner-size - $border-width * 2;
    border-radius: 50%;
    background: $color-primary;
  }
}

@keyframes loadingSpin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
