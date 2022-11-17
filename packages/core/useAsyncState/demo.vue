<script setup lang="ts">
import axios from 'axios'
import YAML from 'js-yaml'
import { useAsyncState } from '@vueuse/core'

const { isLoading, state, isReady, execute } = useAsyncState(
  (args) => {
    console.log(args)
    const id = args?.id || 200
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
    <note :class="{ 'is-ready': isReady }">
      Ready: {{ isReady.toString() }}
    </note>
    <note :class="{ 'is-loading': isLoading }">
      Loading: {{ isLoading.toString() }}
    </note>
    <pre lang="json" class="ml-2">{{ YAML.dump(state) }}</pre>
    <button @click="execute(2000, { id: ~~(Math.random() * 200) })">
      Execute
    </button>
  </div>
</template>

<style scoped>
.is-loading {
  transition: 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
  color: #d67e36;
}

.is-ready {
  color: var(--vp-c-brand);
  transition: 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.note {
  transition: 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
}
</style>
