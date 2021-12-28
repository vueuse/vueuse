<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core'
import Loading from './components/Loading.vue'
import { useLoadingFn } from '.'

const [isLoading, useThisFn] = useLoadingFn(async() => {
  await promiseTimeout(1200)
})
</script>

<template>
  <div>
    <Loading v-show="isLoading" />
    <p>isLoading: {{ isLoading ? 'true' : 'false' }}</p>
    <button @click="useThisFn()">
      Toggle
    </button>
  </div>
</template>
