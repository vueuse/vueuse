<script setup lang="ts">
import { ref, toRefs } from 'vue-demi'
import { useScroll } from '.'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState, directions } = useScroll(el)
const { left, right, top, bottom } = toRefs(arrivedState)
const { left: toLeft, right: toRight, top: toTop, bottom: toBottom } = toRefs(directions)
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
      <div class="px-6 py-4 rounded grid grid-cols-[120px,auto] gap-2 bg-gray-500/5">
        <span text="right" opacity="75">Position</span>
        <div class="text-primary">
          {{ x.toFixed(1) }}, {{ y.toFixed(1) }}
        </div>
        <span text="right" opacity="75">isScrolling</span>
        <BooleanDisplay :value="isScrolling" />
        <div text="right" opacity="75">
          Top Arrived
        </div>
        <BooleanDisplay :value="top" />
        <div text="right" opacity="75">
          Right Arrived
        </div>
        <BooleanDisplay :value="right" />
        <div text="right" opacity="75">
          Bottom Arrived
        </div>
        <BooleanDisplay :value="bottom" />
        <div text="right" opacity="75">
          Left Arrived
        </div>
        <BooleanDisplay :value="left" />
        <div text="right" opacity="75">
          Scrolling Up
        </div>
        <BooleanDisplay :value="toTop" />
        <div text="right" opacity="75">
          Scrolling Right
        </div>
        <BooleanDisplay :value="toRight" />
        <div text="right" opacity="75">
          Scrolling Down
        </div>
        <BooleanDisplay :value="toBottom" />
        <div text="right" opacity="75">
          Scrolling Left
        </div>
        <BooleanDisplay :value="toLeft" />
      </div>
    </div>
  </div>
</template>
