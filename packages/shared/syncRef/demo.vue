<script setup lang="ts">
import { syncRef } from '@vueuse/core'
import { shallowRef } from 'vue'

const a = shallowRef('')
const b = shallowRef('')

syncRef(a, b)
</script>

<template>
  <input v-model="a" placeholder="A" type="text">
  <input v-model="b" placeholder="B" type="text">
</template>
