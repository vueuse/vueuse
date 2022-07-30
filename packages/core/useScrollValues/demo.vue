<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useScrollValues } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, distances, rates } = useScrollValues(el)
const { left, right, top, bottom } = toRefs(distances)
const { horizontal, vertical } = toRefs(rates)
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
        <span text="right" opacity="75">Position</span>
        <div class="text-primary">
          {{ x.toFixed(1) }}, {{ y.toFixed(1) }}
        </div>
        <span text="right" opacity="75">isScrolling</span>
        <BooleanDisplay :value="isScrolling" />
        <div text="right" opacity="75">
          To Top
        </div>
        <div>{{ top.toFixed(1) }}</div>
        <div text="right" opacity="75">
          To Right
        </div>
        <div>{{ right.toFixed(1) }}</div>
        <div text="right" opacity="75">
          To Bottom
        </div>
        <div>{{ bottom.toFixed(1) }}</div>
        <div text="right" opacity="75">
          To Left
        </div>
        <div>{{ left.toFixed(1) }}</div>
        <div text="right" opacity="75">
          Scrolling Vertical
        </div>
        <div>{{ vertical.toFixed(1) }}</div>
        <div text="right" opacity="75">
          Scrolling Horizontal
        </div>
        <div>{{ horizontal.toFixed(1) }}</div>
      </div>
    </div>
  </div>
</template>
