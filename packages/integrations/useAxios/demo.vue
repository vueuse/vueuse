<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { computed, ref } from 'vue'
import { useAxios } from '.'

const counter = ref(1)
const refetch = ref(false)

const url = computed(() => `https://jsonplaceholder.typicode.com/todos/${counter.value}`)
const { data, isLoading, isFinished, execute, abort, isAborted } = useAxios<string>(url, undefined)

const text = stringify(data)
</script>

<template>
  <button @click="execute()">
    Execute
  </button>
  <button @click="abort()">
    Abort
  </button>
  <note>Loading: {{ isLoading.toString() }}</note>
  <note>Finished: {{ isFinished.toString() }}</note>
  <note>Aborted: {{ isAborted.toString() }}</note>
  <pre lang="yaml">{{ text }}</pre>
</template>
