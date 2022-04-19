<script setup lang="ts">
import { ref } from 'vue'
import { useRafFn } from '@vueuse/core'

const count = ref(0)
const { pause, resume } = useRafFn(() => count.value += 1)
</script>

<template>
  <div>Count: {{ count }}</div>
  <button @click="pause">
    pause
  </button>
  <button @click="resume">
    resume
  </button>
</template>
