<script setup lang="ts">
import { ref } from 'vue-demi'
import { usePrint } from '@vueuse/core'

const source = ref('<h1>Hello vueuse!</h1>')
const { printSource } = usePrint(source)
</script>

<template>
  <textarea v-model="source" />
  <button @click="() => printSource()">
    Print
  </button>
</template>
