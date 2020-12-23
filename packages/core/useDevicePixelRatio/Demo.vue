<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useDevicePixelRatio } from '.'

const pixelRatio = useDevicePixelRatio({ window = window.parent })
</script>

<template>
  <div>
    <strong>Device Pixel Ratio:</strong> <code>{{ pixelRatio }}</code>
  </div>
</template>
