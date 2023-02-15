<script setup lang="ts">
import { ref } from 'vue'
import { useFullscreen } from '@vueuse/core'

const el = ref(null)
const { toggle } = useFullscreen(el)
</script>

<template>
  <div class="text-center">
    <div class="flex" p="y-4">
      <video
        ref="el"
        class="m-auto rounded"
        src="https://vjs.zencdn.net/v/oceans.mp4"
        width="600"
        controls
      />
    </div>
    <button @click="toggle">
      Go Fullscreen
    </button>
  </div>
</template>
