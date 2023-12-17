<script setup lang="ts">
import axios from 'axios'
import YAML from 'js-yaml'
import { useCancellableAsyncState } from '@vueuse/core'

const { isLoading, state, isReady, execute } = useCancellableAsyncState(
  (onCancel, args: unknown) => {
    const abortController = new AbortController()
    onCancel(() => abortController.abort())
    const id = args?.id || 1
    return axios.get(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      { signal: abortController.signal },
    ).then(t => t.data)
  },
  {},
  {
    resetOnExecute: false,
  },
)
</script>

<template>
  <div>
    <note>Ready: {{ isReady.toString() }}</note>
    <note>Loading: {{ isLoading.toString() }}</note>
    <pre lang="json" class="ml-2">{{ YAML.dump(state) }}</pre>
    <button @click="execute(0, { id: 2 })">
      Execute
    </button>
  </div>
</template>
