<script setup lang="ts">
import { useFps } from '@vueuse/core'

const fps = useFps()
</script>

<template>
  FPS: {{ fps }}
</template>
