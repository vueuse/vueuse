<script setup lang="ts">
import { syncRef } from '@vueuse/core'
import { ref } from 'vue'

const a = ref('')
const b = ref('')

syncRef(a, b)
</script>

<template>
  <input v-model="a" placeholder="A" type="text">
  <input v-model="b" placeholder="B" type="text">
</template>
