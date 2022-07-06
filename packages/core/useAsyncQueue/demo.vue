<script setup lang="ts">
import { useAsyncQueue } from '@vueuse/core'

const p1 = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000)
    }, 10)
  })
}

const p2 = (result: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000 + result)
    }, 20)
  })
}

const { activeIndex, result } = useAsyncQueue([p1, p2])
</script>

<template>
  <div>
    <note>activeIndex: {{ activeIndex }}</note>
    <note>result: {{ result }}</note>
  </div>
</template>
