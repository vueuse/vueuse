<script setup lang="ts">
import { formatDate } from '@vueuse/shared'
import { useAsyncFunction } from '.'

const fn = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(formatDate(new Date(), 'HH:mm:ss'))
    }, 2000)
  }).then(d => d)
}

const single = useAsyncFunction(fn)

const { result: results, ...several } = useAsyncFunction<string>(fn, { several: true })
</script>

<template>
  <h3>Single call</h3>
  <div>isLoading: {{ single.isLoading }}</div>
  <div>current: {{ single.loadingCalls }}</div>
  <div>calls: {{ single.calls }}</div>

  <button @click="single.trigger">
    call async function
  </button>

  <div>result: {{ single.result || '' }}</div>

  <h3>Several calls</h3>
  <div>isLoading: {{ several.isLoading }}</div>
  <div>current: {{ several.loadingCalls }}</div>
  <div>calls: {{ several.calls }}</div>
  <button @click="several.trigger">
    call async function
  </button>
  <div>results:</div>
  <div class="max-h-[100px] overflow-auto">
    <div v-for="d in results" :key="d">
      {{ d }}
    </div>
  </div>
</template>
