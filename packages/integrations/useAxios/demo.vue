<script setup lang="ts">
import { computed, ref } from 'vue'
import { stringify } from '@vueuse/docs-utils'
import { useAxios } from '.'

const id = ref(1)

const { data, isLoading, isFinished, execute } = useAxios(
  computed(() => `https://jsonplaceholder.typicode.com/todos/${id.value}`),
)
const text = stringify(data)
</script>

<template>
  <button @click="execute()">
    Execute
  </button>
  <button @click="id = id + 1">
    Change ID
  </button>
  <note>Loading: {{ isLoading.toString() }}</note>
  <note>Finished: {{ isFinished.toString() }}</note>
  <pre lang="yaml">{{ text }}</pre>
</template>
