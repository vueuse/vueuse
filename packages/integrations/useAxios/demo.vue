<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { computed, ref as deepRef } from 'vue'
import { useAxios } from './index'

const counter = deepRef(1)
const refetch = deepRef(true)

const url = computed(() => `https://jsonplaceholder.typicode.com/todos/${counter.value}`)
const { data, isLoading, isFinished, execute, abort, isAborted } = useAxios<string>(url, undefined, {
  refetch,
  immediate: true,
})

const text = stringify(data)
</script>

<template>
  <button @click="counter = counter + 1">
    Increment
  </button>
  <button @click="refetch = !refetch">
    Toggle Refetch {{ String(refetch) }}
  </button>
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
