<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useFullscreen } from '.'

const el = ref(null)
const { toggle } = useFullscreen(el)

const el, toggle
</script>

<template>
  <div style="text-align: center">
    <video
      ref="el"
      src="https://vjs.zencdn.net/v/oceans.mp4"
      width="400"
      style="margin: 0 auto"
      controls
    ></video>
    <br />
    <button @click="toggle">Go Fullscreen</button>
  </div>
</template>
