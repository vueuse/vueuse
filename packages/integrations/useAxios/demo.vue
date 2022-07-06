<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useAxios } from '.'

const { data, isLoading, isFinished, execute } = useAxios(
  'https://jsonplaceholder.typicode.com/todos/1',
)
const text = stringify(data)
</script>

<template>
  <button @click="execute()">
    Execute
  </button>
  <note>Loading: {{ isLoading.toString() }}</note>
  <note>Finished: {{ isFinished.toString() }}</note>
  <pre lang="yaml">{{ text }}</pre>
</template>
