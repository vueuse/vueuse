<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { useVirtualList } from '@vueuse/core'

const index: Ref = ref()
const search = ref('')

const allItems = Array.from(Array(99999).keys())
  .map(i => ({
    height: i % 2 === 0 ? 42 : 84,
    size: i % 2 === 0 ? 'small' : 'large',
  }))

const filteredItems = computed(() => {
  return allItems.filter(i => i.size.startsWith(search.value.toLowerCase()))
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  filteredItems,
  {
    itemHeight: i => (filteredItems.value[i].height + 8),
    overscan: 10,
  },
)
const handleScrollTo = () => {
  scrollTo(index.value)
}
</script>

<template>
  <div>
    <div>
      <div class="inline-block mr-4">
        Jump to index
        <input v-model="index" placeholder="Index" type="number">
      </div>
      <button type="button" @click="handleScrollTo">
        Go
      </button>
    </div>
    <div>
      <div class="inline-block mr-4">
        Filter list by size
        <input v-model="search" placeholder="e.g. small, medium, large" type="search">
      </div>
    </div>
    <div v-bind="containerProps" class="h-300px overflow-auto p-2 bg-gray-500/5 rounded">
      <div v-bind="wrapperProps">
        <div
          v-for="{ index, data } in list"
          :key="index"
          class="border border-$c-divider mb-2"
          :style="{
            height: `${data.height}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }"
        >
          Row {{ index }} <span opacity="70" m="l-1">({{ data.size }})</span>
        </div>
      </div>
    </div>
  </div>
</template>
