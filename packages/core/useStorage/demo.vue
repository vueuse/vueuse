<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useStorage } from '.'

const state = useStorage('vue-use-locale-storage', {
  name: 'Banana',
  color: 'Yellow',
  size: 'Medium',
})

const state
</script>

<template>
  <div>
    <input v-model="state.name" type="text" />
    <input v-model="state.color" type="text" />
    <input v-model="state.size" type="text" />

    <pre lang="json">{{ JSON.stringify(state, null, 2) }}</pre>
  </div>
</template>
