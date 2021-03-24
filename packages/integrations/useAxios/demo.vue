<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useAxios } from '.'

const { data, loading } = useAxios(
  'https://jsonplaceholder.typicode.com/todos/1',
)
const text = stringify(data)
</script>

<template>
  <note>Finished: {{ loading.toString() }}</note>
  <pre lang="yaml">{{ text }}</pre>
</template>
