<script setup lang="ts">
import { stringify, useDevicePixelRatio } from '@vueuse/core'
import { reactive } from 'vue'

const pixelRatio = reactive(useDevicePixelRatio())
const code = stringify(pixelRatio)
</script>

<template>
  <div>Device Pixel Ratio:</div>
  <pre>{{ code }}</pre>
  <span class="opacity-50">Zoom in and out (or move the window to a screen with a different scaling factor) to see the value changes</span>
</template>
