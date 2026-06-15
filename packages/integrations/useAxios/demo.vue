<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios'
import { reactify } from '@vueuse/shared'
import YAML from 'yaml'

const stringify = reactify(
  (input: any) => YAML.stringify(input, (k, v) => {
    if (typeof v === 'function') {
      return undefined
    }
    return v
  }, {
    singleQuote: true,
    flowCollectionPadding: false,
  }),
)

const { data, isLoading, isFinished, execute, abort, isAborted } = useAxios(
  'https://jsonplaceholder.typicode.com/todos/1',
)
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
