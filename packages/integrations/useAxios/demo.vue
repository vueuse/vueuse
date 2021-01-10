<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useAxios } from '.'

const { data, finished } = useAxios(
  'https://jsonplaceholder.typicode.com/todos/1',
)
</script>

<template>
  <note>Finished: {{ finished.toString() }}</note>
  <pre lang="json">{{ JSON.stringify(data, null, 2) }}</pre>
</template>
