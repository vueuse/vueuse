<script setup lang="ts">
import { useDevicePixelRatio } from '.'

const pixelRatio = useDevicePixelRatio()
</script>

<template>
  <div>
    <strong>Device Pixel Ratio:</strong> <code>{{ pixelRatio }}</code>
  </div>
</template>
