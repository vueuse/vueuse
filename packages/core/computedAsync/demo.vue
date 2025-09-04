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
const last = shallowRef(null)

const state = computedAsync(
  async (onCancel) => {
    const abortController = new AbortController()
    onCancel(() => abortController.abort())

    try {
      const resp = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id.value}`,
        { signal: abortController.signal },
      )
      if (!resp.ok)
        throw new Error(`HTTP ${resp.status}`)

      const data = await resp.json()
      last.value = data
      return data
    }
    catch (e: any) {
      if (e?.name === 'AbortError')
        return last.value
      throw e
    }
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
