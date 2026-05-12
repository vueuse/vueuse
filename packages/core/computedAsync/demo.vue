<script setup lang="ts">
import { computedAsync, reactify } from '@vueuse/core'
import { shallowRef } from 'vue'
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

const id = shallowRef(1)
const evaluating = shallowRef(false)

const state = computedAsync(
  async (onCancel) => {
    const abortController = new AbortController()
    onCancel(() => abortController.abort())

    return await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id.value}`,
      { signal: abortController.signal },
    ).then(resp => resp.json())
  },
  null,
  {
    evaluating,
  },
)

function change() {
  id.value++
}
</script>

<template>
  <div>
    <note>
      Evaluating: {{ evaluating }}
    </note>
    <pre lang="json" class="ml-2">{{ stringify(state) }}</pre>
    <button @click="change">
      Change
    </button>
  </div>
</template>
