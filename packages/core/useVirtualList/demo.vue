<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

const index = shallowRef<number>()
const search = shallowRef<'' | 'small' | 'large'>('')
const smoothScroll = shallowRef(false)
const block = shallowRef<ScrollLogicalPosition>('start')

const allItems = Array.from(Array.from({ length: 99999 }).keys())
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
function handleScrollTo() {
  if (typeof index.value === 'number')
    scrollTo(index.value, { behavior: smoothScroll.value ? 'smooth' : 'auto', block: block.value })
}
</script>

<template>
  <div>
    <form @submit.prevent="handleScrollTo">
      <div class="inline-block mr-4">
        Jump to index
        <input v-model="index" placeholder="Index" type="number">
      </div>
      <label class="inline-block mr-4"><input v-model="smoothScroll" type="checkbox"> Smooth</label>
      <div bg="$vp-c-bg" border="$vp-c-divider 1" inline-flex items-center relative rounded>
        <i v-if="block === 'start'" i-carbon-align-vertical-top absolute left-2 opacity-80 pointer-events-none />
        <i v-if="block === 'center'" i-carbon-align-vertical-center absolute left-2 opacity-80 pointer-events-none />
        <i v-if="block === 'end'" i-carbon-align-vertical-bottom absolute left-2 opacity-80 pointer-events-none />
        <i v-if="block === 'nearest'" i-carbon-arrows-vertical absolute left-2 opacity-80 pointer-events-none />
        <select v-model="block" px-8 border-0 bg-transparent h-9 rounded appearance-none>
          <option value="start">
            Start
          </option>
          <option value="center">
            Center
          </option>
          <option value="end">
            End
          </option>
          <option value="nearest">
            Nearest
          </option>
        </select>
        <i i-carbon-chevron-down absolute right-2 opacity-80 pointer-events-none />
      </div>
      <button type="submit">
        Go
      </button>
    </form>
    <div>
      <div class="inline-block mr-4">
        <div>Filter list by size</div>
        <div bg="$vp-c-bg" border="$vp-c-divider 1" inline-flex items-center relative rounded mb-2>
          <select v-model="search" pl-4 pr-8 border-0 bg-transparent h-9 rounded appearance-none>
            <option value="">
              All
            </option>
            <option value="small">
              Small
            </option>
            <option value="large">
              Large
            </option>
          </select>
          <i i-carbon-chevron-down absolute right-2 opacity-80 pointer-events-none />
        </div>
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
