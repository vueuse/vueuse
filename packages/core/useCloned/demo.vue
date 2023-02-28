<script setup lang="ts">
import { useCloned } from '@vueuse/core'

const template = { fruit: 'banana', drink: 'water' }

const { cloned, sync } = useCloned(template)
</script>

<template>
  <input v-model="cloned.fruit" type="text">
  <input v-model="cloned.drink" type="text">

  <button @click="sync()">
    reset
  </button>
</template>
