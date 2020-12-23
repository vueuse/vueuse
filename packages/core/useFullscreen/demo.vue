<script setup lang="ts">
import { ref } from 'vue-demi'
import { useFullscreen } from '.'

const el = ref(null)
const { toggle } = useFullscreen(el)
</script>

<template>
  <div class="text-center">
    <video
      ref="el"
      class="mx-0 my-auto"
      src="https://vjs.zencdn.net/v/oceans.mp4"
      width="400"
      controls
    />
    <br>
    <button @click="toggle">
      Go Fullscreen
    </button>
  </div>
</template>
