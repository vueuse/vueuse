<script setup lang="ts">
import { createGlobalState, yamlStringify as stringify, useStorage } from '@vueuse/core'

const useState = createGlobalState(() =>
  useStorage('vue-use-locale-storage', {
    name: 'Banana',
    color: 'Yellow',
    size: 'Medium',
  }))

const state = useState()
const text = stringify(state)
</script>

<template>
  <div>
    <input v-model="state.name" type="text">
    <input v-model="state.color" type="text">
    <input v-model="state.size" type="text">

    <pre lang="yaml">{{ text }}</pre>
  </div>
</template>
