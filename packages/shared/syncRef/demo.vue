<script setup lang="ts">
import { ref } from 'vue-demi'
import { syncRef } from '.'

const source = ref('')
const target1 = ref('')
const target2 = ref('')

syncRef(source, [target1, target2])
</script>

<template>
  <div>
    <input v-model="source" placeholder="Source">
    <input v-model="target1" placeholder="Target1">
    <input v-model="target2" placeholder="Target2">
  </div>
</template>
