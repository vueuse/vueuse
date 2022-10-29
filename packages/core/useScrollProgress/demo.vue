<script setup lang="ts">
import { computed, ref } from 'vue-demi'
import { useScrollProgress } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { progressX, progressY } = useScrollProgress(el, { behavior: 'smooth' })

// Format the numbers with toFixed() to make them
// nicer to display
const displayProgressX = computed({
  get() {
    return progressX.value.toFixed(2)
  },
  set(val) {
    progressX.value = parseFloat(val)
  },
})
const displayProgressY = computed({
  get() {
    return progressY.value.toFixed(2)
  },
  set(val) {
    progressY.value = parseFloat(val)
  },
})
</script>

<template>
  <div class="flex">
    <div ref="el" class="w-300px h-300px m-auto overflow-scroll bg-gray-500/5 rounded">
      <div class="w-500px h-400px relative">
        <div position="absolute left-0 top-0" bg="gray-500/5" p="x-2 y-1">
          TopLeft
        </div>
        <div position="absolute left-0 bottom-0" bg="gray-500/5" p="x-2 y-1">
          BottomLeft
        </div>
        <div position="absolute right-0 top-0" bg="gray-500/5" p="x-2 y-1">
          TopRight
        </div>
        <div position="absolute right-0 bottom-0" bg="gray-500/5" p="x-2 y-1">
          BottomRight
        </div>
        <div position="absolute left-1/3 top-1/3" bg="gray-500/5" p="x-2 y-1">
          Scroll Me
        </div>
      </div>
    </div>
    <div class="m-auto w-280px pl-4">
      <div class="px-6 py-4 rounded grid grid-cols-[120px_auto] gap-2 bg-gray-500/5">
        <span text="right" opacity="75" class="py-4">X Progress</span>
        <div class="text-primary">
          <div>
            <input v-model="displayProgressX" type="number" min="0" max="200" step="10" class="w-full !min-w-0">
          </div>
        </div>
        <span text="right" opacity="75" class="py-4">Y Progress</span>
        <div class="text-primary">
          <div>
            <input v-model="displayProgressY" type="number" min="0" max="100" step="10" class="w-full !min-w-0">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
