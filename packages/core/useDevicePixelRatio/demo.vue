<script setup lang="ts">
import { reactive } from 'vue-demi'
import YAML from 'js-yaml'
import { useDevicePixelRatio } from '.'

const pixelRatio = reactive(useDevicePixelRatio())
const code = YAML.safeDump(pixelRatio)
</script>

<template>
  <div>Device Pixel Ratio:</div>
  <pre>{{ code }}</pre>
</template>
