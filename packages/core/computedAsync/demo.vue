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

async function fetchData(id: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        createdAt: new Date().toISOString(),
      })
    }, 1000)
  })
}

const id = shallowRef(1)
const evaluating = shallowRef(false)

const data = computedAsync(
  async () => {
    return await fetchData(id.value)
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
    <pre lang="json" class="ml-2">{{ stringify(data) }}</pre>
    <button @click="change">
      Change
    </button>
  </div>
</template>
