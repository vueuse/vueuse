<script setup lang="ts">
import { ref } from 'vue-demi'
import { useImageLazyLoad } from './index'

const target = ref()
const { src } = useImageLazyLoad(target, {
  src: '/pwa-512x512.png',
})
</script>

<template>
  <div ref="root" class="root">
    <p class="notice">
      Scroll me down!
    </p>
    <img
      ref="target"
      class="target"
      :src="src"
      alt="it's a VueUse icon"
    >
  </div>
</template>

<style scoped>
.root {
  border: 2px dashed #ccc;
  height: 200px;
  margin: 0 2rem 1rem;
  overflow-y: scroll;
}
.notice {
  text-align: center;
  padding: 2em 0;
  margin-bottom: 300px;
  font-style: italic;
  font-size: 1.2rem;
  opacity: 0.8;
}
.target {
  /*width: 250px;*/
  border: 2px dashed var(--c-brand);
  padding: 10px;
  max-height: 150px;
  margin: 0 2rem 1rem;
  margin-bottom: 400px;
}
</style>
