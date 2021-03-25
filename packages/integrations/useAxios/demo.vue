<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useAxios } from '.'

const { data, loading, finished } = useAxios(
  'https://jsonplaceholder.typicode.com/todos/1',
)
const text = stringify(data)
</script>

<template>
  <note>Loading: {{ loading.toString() }}</note>
  <note>Finished: {{ finished.toString() }}</note>
  <pre lang="yaml">{{ text }}</pre>
</template>
