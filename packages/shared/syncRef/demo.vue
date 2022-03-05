<script setup lang="ts">
import { ref } from 'vue'
import { syncRef } from '@vueuse/core'

const a = ref('')
const b = ref('')

syncRef(a, b)
</script>

<template>
  <input v-model="a" placeholder="A" type="text">
  <input v-model="b" placeholder="B" type="text">
</template>
