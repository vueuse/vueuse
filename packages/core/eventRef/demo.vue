<script setup lang="ts">
import { eventRef } from '@vueuse/core'

const [scrollTop] = eventRef((handler) => {
  window.addEventListener('scroll', handler)
  return () => window.removeEventListener('scroll', handler)
}, {
  get: () => window.pageYOffset ?? window.scrollY,
  set: val => window.scrollTo(0, val),
})

const handleScrollToClick = () => {
  scrollTop.value = 100
}
</script>

<template>
  <div>
    <div>
      See scroll values in the lower right corner of the screen.
    </div>
    <div class="scroller" />
    <div class="float">
      <note class="mb-2">
        Scroll Top value
      </note>
      <p>{{ scrollTop }}</p>
      <button @click="handleScrollToClick">
        Scroll Top to 100
      </button>
    </div>
  </div>
</template>

<style scoped>
.scroller {
  position: absolute;
  top: 100%;
  left: 100%;
  width: 1px;
  height: 10000px;
}
</style>
