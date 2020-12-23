<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { createGlobalState } from '.'
import { useStorage } from '../useStorage'

const state = useState()

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
