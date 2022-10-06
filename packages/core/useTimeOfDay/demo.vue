<script setup lang="ts">
import { useTimeOfDay } from '@vueuse/core'

const { timeOfDay } = useTimeOfDay()
</script>

<template>
  <div>
    <p>Good {{ timeOfDay }} from VueUse</p>
  </div>
</template>
