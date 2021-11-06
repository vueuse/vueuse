<template>
  FPS: {{ fps }}
</template>

<script setup lang="ts">
import { useFps } from './index'

const fps = useFps()
</script>
