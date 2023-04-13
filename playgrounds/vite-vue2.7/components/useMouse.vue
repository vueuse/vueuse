<script setup lang="ts">
import { useMouse } from '@vueuse/core'

const { x, y } = useMouse()
</script>

<template>
  <div>
    Hello {{ x }}, {{ y }}
  </div>
</template>
