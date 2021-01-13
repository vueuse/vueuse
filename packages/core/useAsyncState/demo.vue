<script setup lang="ts">
import axios from 'axios'
import YAML from 'js-yaml'
import { useAsyncState } from '.'

const { state, ready } = useAsyncState(
  axios.get('https://jsonplaceholder.typicode.com/todos/1').then(t => t.data),
  {},
  2000,
)
</script>

<template>
  <div>
    <note>Ready: {{ ready.toString() }}</note>
    <pre lang="json" class="ml-2">{{ YAML.dump(state) }}</pre>
  </div>
</template>
