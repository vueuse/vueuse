<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { x, y } = useWindowScroll({ behavior: 'smooth' })
</script>

<template>
  <div>
    <div>
      See scroll values in the lower right corner of the screen.
    </div>
    <div class="scroller" />
    <div class="float">
      <note class="mb-2">
        Scroll value
      </note>
      x: {{ x }}<br>
      y: {{ y }}
    </div>
  </div>
  <button @click="x += 200">
    scroll X
  </button>
  <button @click="y += 200">
    scroll Y
  </button>
</template>

<style scoped>
.scroller {
  position: absolute;
  top: 100%;
  left: 100%;
  width: 10000px;
  height: 10000px;
}
</style>
