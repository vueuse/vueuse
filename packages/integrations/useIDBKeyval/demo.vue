<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useIDBKeyval } from '@vueuse/integrations'

const state = useIDBKeyval('vue-use-idb-keyval', {
  name: 'Banana',
  color: 'Yellow',
  size: 'Medium',
  count: 0,
})

const text = stringify(state)
</script>

<template>
  <input v-model="state.name" type="text">
  <input v-model="state.color" type="text">
  <input v-model="state.size" type="text">
  <input v-model.number="state.count" type="range" min="0" step="0.01" max="1000">

  <pre lang="json">{{ text }}</pre>
</template>
