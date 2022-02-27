<script setup lang="ts">
import { ref, toRefs } from 'vue-demi'
import { useScroll } from '.'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, isWheeling, arrivedState, scrollDirections, wheelDirections } = useScroll(el)
const { left, right, top, bottom } = toRefs(arrivedState)
const { left: toLeft, right: toRight, top: toTop, bottom: toBottom } = toRefs(scrollDirections)
const { left: wheelLeft, right: wheelRight, top: wheelTop, bottom: wheelBottom } = toRefs(wheelDirections)
</script>

<template>
  <div class="flex flex-col">
    <div ref="el" class="w-11/12 h-300px m-auto overflow-scroll bg-gray-500/5 rounded">
      <div class="w-900px h-400px relative">
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
    <div class="m-auto flex mt-4">
      <div class="w-208px px-6 py-4 rounded grid grid-cols-[110px,auto] gap-2 bg-gray-500/5">
        <span text="right" opacity="75">Position</span>
        <div class="text-primary overflow-visible">
          {{ x.toFixed(1) }},<br>{{ y.toFixed(1) }}
        </div>
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
      </div>
      <div class="px-6 py-4 rounded grid grid-cols-[110px,auto] gap-2 bg-gray-500/5">
        <span text="right" opacity="75">isScrolling</span>
        <BooleanDisplay :value="isScrolling" />
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
      <div class="px-6 py-4 rounded grid grid-cols-[110px,auto] gap-2 bg-gray-500/5">
        <span text="right" opacity="75">isWheeling</span>
        <BooleanDisplay :value="isWheeling" />
        <div text="right" opacity="75">
          Wheeling Up
        </div>
        <BooleanDisplay :value="wheelTop" />
        <div text="right" opacity="75">
          Wheeling Right
        </div>
        <BooleanDisplay :value="wheelRight" />
        <div text="right" opacity="75">
          Wheeling Down
        </div>
        <BooleanDisplay :value="wheelBottom" />
        <div text="right" opacity="75">
          Wheeling Left
        </div>
        <BooleanDisplay :value="wheelLeft" />
      </div>
    </div>
  </div>
</template>
