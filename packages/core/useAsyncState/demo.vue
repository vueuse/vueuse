<script setup lang="ts">
import { reactify } from '@vueuse/core'
import axios from 'axios'
import YAML from 'yaml'
import { useAsyncState } from './index'

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

const { isLoading, state, isReady, execute } = useAsyncState(
  (args) => {
    const id = args?.id || 1
    return axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`).then(t => t.data)
  },
  {},
  {
    delay: 2000,
    resetOnExecute: false,
  },
)

function p(num = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num)
    }, num * 1000)
  })
}
const { execute: _excute, state: num, cancel } = useAsyncState(p, 0, { cancellable: true })
function executeCancelable() {
  _excute(0, 1)
  _excute(0, 3)
  _excute(0, 2)
}
</script>

<template>
  <div>
    <div>
      <note>Ready: {{ isReady.toString() }}</note>
      <note>Loading: {{ isLoading.toString() }}</note>
      <pre lang="json" class="ml-2">{{ stringify(state) }}</pre>
      <button @click="() => execute(2000, { id: 2 })">
        Execute
      </button>
    </div>
    <div>
      <note>num:{{ num }}</note>
      <button @click="executeCancelable">
        executeCancelable
      </button>
      <button @click="cancel">
        cancel
      </button>
    </div>
  </div>
</template>
