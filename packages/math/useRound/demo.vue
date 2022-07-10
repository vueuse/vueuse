<script setup lang="ts">
import { ref } from 'vue'
import { useRound } from '@vueuse/math'
const max = ref(10.2)

const value = useRound(max)
console.log(value)
</script>

<template>
  <div>
    {{ value }}
  </div>
</template>
