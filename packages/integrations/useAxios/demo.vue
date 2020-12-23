<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useAxios } from '.'

const { data, finished } = useAxios(
  'https://jsonplaceholder.typicode.com/todos/1'
)

const data, finished
</script>

<template>
  <div>
    <note>Finished: {{ finished.toString() }}</note>
    <pre lang="json" class="ml-2">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
