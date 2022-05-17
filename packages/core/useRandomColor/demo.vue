<script setup lang="ts">
import { useRandomColor } from '@vueuse/core'

const { color, changeColor } = useRandomColor({
  type: 'RGB',
})
defineExpose({ color, changeColor })
</script>

<template>
  Color:
  <div :style="{ color }">
    {{ color }}
  </div>
  <button @click="changeColor">
    Change Color
  </button>
</template>

<style scoped >

</style>
