<script setup lang="ts">
import { reactive } from 'vue'
import { stringify } from '@vueuse/docs-utils'
import { useDevicePixelRatio } from '@vueuse/core'

const pixelRatio = reactive(useDevicePixelRatio())
const code = stringify(pixelRatio)
</script>

<template>
  <div>Device Pixel Ratio:</div>
  <pre>{{ code }}</pre>
</template>
