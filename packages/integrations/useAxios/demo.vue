<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { defineComponent } from 'vue-demi'
import { useAxios } from '.'

const { data, finished } = useAxios(
  'https://jsonplaceholder.typicode.com/todos/1',
)
const text = stringify(data)
</script>

<template>
  <note>Finished: {{ finished.toString() }}</note>
  <pre lang="yaml">{{ text }}</pre>
</template>
