<script setup lang="ts">
import { ref } from 'vue'
import { refBind } from '@vueuse/core'

const a = ref('')
const b = refBind(a)
</script>

<template>
  <input v-model="a" placeholder="A" type="text">
  <input v-model="b" placeholder="B" type="text">
</template>
