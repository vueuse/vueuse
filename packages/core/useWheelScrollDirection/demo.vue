<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { useWheelScrollDirection } from '.'

const el = ref<HTMLElement | null>(null)

const direction = ref('horizontal') as Ref<'auto' | 'horizontal' | 'vertical'>
const scrollDeltaRatio = ref(1)

useWheelScrollDirection(el, {
  direction,
  scrollDeltaRatio,
})

watch(direction, (newValue) => {
  newValue === 'auto' && (scrollDeltaRatio.value = 1)
})
</script>

<template>
  <div class="flex items-center">
    direction:
    <input id="auto" v-model="direction" class="mx-5px" type="radio" value="auto">
    <label for="auto">auto</label>

    <input id="horizontal" v-model="direction" class="mx-5px" type="radio" value="horizontal">
    <label for="horizontal">horizontal</label>

    <input id="vertical" v-model="direction" class="mx-5px" type="radio" value="vertical">
    <label for="vertical">vertical</label>
  </div>
  <div>
    scrollDeltaRatio:
    <input
      v-model="scrollDeltaRatio"
      type="number"
      min="0"
      max="1"
      :disabled="direction === 'auto'"
    >
  </div>

  <div ref="el" class="rounded m-auto bg-gray-500/5 h-300px w-300px overflow-scroll">
    <div class="h-400px w-500px relative">
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
</template>
