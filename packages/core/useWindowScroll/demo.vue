<script setup lang="ts">
import { useWindowScroll } from '.'

const { x, y } = useWindowScroll()
</script>

<template>
  <div>
    <note>See scroll values in the lower right corner of the screen.</note>
    <div class="scroller" />
    <div class="info">
      <p>x: {{ x }}</p>
      <p>y: {{ y }}</p>
    </div>
  </div>
</template>

<style scoped>
.scroller {
  position: absolute;
  top: 100%;
  left: 100%;
  width: 10000px;
  height: 10000px;
}

.info {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 1em 5em 1em 1.5em;
  min-width: 320px;
}
</style>
