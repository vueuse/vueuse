<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { ref as deepRef, useTemplateRef } from 'vue'

const el = useTemplateRef<HTMLElement>('el')
const data = deepRef<number[]>([])

const { reset } = useInfiniteScroll(
  el,
  () => {
    const length = data.value.length + 1
    data.value.push(...Array.from({ length: 5 }, (_, i) => length + i))
  },
  {
    distance: 10,
    canLoadMore: () => {
      // inidicate when there is no more content to load so onLoadMore stops triggering
      // if (noMoreContent) return false
      return true // for demo purposes
    },
  },
)

function resetList() {
  data.value = []
  reset()
}
</script>

<template>
  <div ref="el" class="flex flex-col gap-2 p-4 w-300px h-300px m-auto overflow-y-scroll bg-gray-500/5 rounded">
    <div v-for="item in data" :key="item" class="h-15 bg-gray-500/5 rounded p-3">
      {{ item }}
    </div>
  </div>
  <button @click="resetList()">
    Reset
  </button>
</template>
