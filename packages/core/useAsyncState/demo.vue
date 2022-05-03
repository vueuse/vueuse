<script setup lang="ts">
import axios from 'axios'
import YAML from 'js-yaml'
import { useAsyncState } from '@vueuse/core'

const { isLoading, state, isReady, execute } = useAsyncState(
  (args) => {
    const id = args?.id || 1
    return axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`).then(t => t.data)
  },
  {},
  {
    delay: 2000,
    resetOnExecute: false,
  },
)
</script>

<template>
  <div>
    <note>Ready: {{ isReady.toString() }}</note>
    <note>Loading: {{ isLoading.toString() }}</note>
    <pre lang="json" class="ml-2">{{ YAML.dump(state) }}</pre>
    <button @click="execute(2000, { id: 2 })">
      Execute
    </button>
  </div>
</template>
