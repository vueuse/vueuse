<script setup lang="ts">
import { ref, toRefs } from 'vue-demi'
import { useScroll } from '.'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState } = useScroll(el)
const { left, right, top, bottom } = toRefs(arrivedState)

const offsetEl = ref<HTMLElement | null>(null)
const offsetVersion = useScroll(offsetEl, {
  offset: { top: 30, bottom: 30, right: 30, left: 30 },
})
</script>

<template>
  <div class="flex pb-40">
    <div ref="el" class="w-300px h-300px m-auto overflow-scroll bg-gray-500/5 rounded">
      <div class="w-500px h-400px relative">
        <div position="absolute left-0 top-0" bg="gray-100/10" p="x-2 y-1">
          TopLeft
        </div>
        <div position="absolute left-0 bottom-0" bg="gray-100/10" p="x-2 y-1">
          BottomLeft
        </div>
        <div position="absolute right-0 top-0" bg="gray-100/10" p="x-2 y-1">
          TopRight
        </div>
        <div position="absolute right-0 bottom-0" bg="gray-100/10" p="x-2 y-1">
          BottomRight
        </div>
        <div position="absolute left-1/3 top-1/3" bg="gray-100/10" p="x-2 y-1">
          Scroll Me
        </div>
      </div>
    </div>
    <div class="m-auto w-280px px-6 py-4 mb-20 rounded grid grid-cols-[120px,auto] gap-2 bg-gray-500/5">
      <span text="right" opacity="75">Position</span>
      <div class="text-primary">
        {{ x }}, {{ y }}
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
    </div>
  </div>
  <span class="pl-32">With offsets (30px on each side):</span>
  <div class="flex pt-4">
    <div ref="offsetEl" class="w-300px h-300px m-auto overflow-scroll bg-gray-500/5 rounded">
      <div class="w-500px h-400px relative">
        <div position="absolute left-30px top-30px" bg="gray-100/10" p="x-2 y-1">
          TopLeft
        </div>
        <div position="absolute left-30px bottom-30px" bg="gray-100/10" p="x-2 y-1">
          BottomLeft
        </div>
        <div position="absolute right-30px top-30px" bg="gray-100/10" p="x-2 y-1">
          TopRight
        </div>
        <div position="absolute right-30px bottom-30px" bg="gray-100/10" p="x-2 y-1">
          BottomRight
        </div>
        <div position="absolute left-1/3 top-1/3" bg="gray-100/10" p="x-2 y-1">
          Scroll Me
        </div>
      </div>
    </div>
    <div class="m-auto w-280px px-6 py-4 mb-20 rounded grid grid-cols-[120px,auto] gap-2 bg-gray-500/5">
      <span text="right" opacity="75">Position</span>
      <div class="text-primary">
        {{ offsetVersion.x }}, {{ offsetVersion.y }}
      </div>
      <span text="right" opacity="75">isScrolling</span>
      <BooleanDisplay :value="offsetVersion.isScrolling" />
      <div text="right" opacity="75">
        Top Arrived
      </div>
      <BooleanDisplay :value="offsetVersion.arrivedState.top" />
      <div text="right" opacity="75">
        Right Arrived
      </div>
      <BooleanDisplay :value="offsetVersion.arrivedState.right" />
      <div text="right" opacity="75">
        Bottom Arrived
      </div>
      <BooleanDisplay :value="offsetVersion.arrivedState.bottom" />
      <div text="right" opacity="75">
        Left Arrived
      </div>
      <BooleanDisplay :value="offsetVersion.arrivedState.left" />
    </div>
  </div>
</template>
