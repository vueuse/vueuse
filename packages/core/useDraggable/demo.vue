<script setup lang="ts">
import { ref } from 'vue'
import { isClient } from '@vueuse/shared'
import { useDraggable } from '@vueuse/core'
import { UseDraggable as Draggable } from './component'

const el = ref<HTMLElement | null>(null)

const innerWidth = isClient ? window.innerWidth : 200

const { x, y, style } = useDraggable(el, {
  initialValue: { x: innerWidth / 4.2, y: 80 },
  preventDefault: true,
})
</script>

<template>
  <div class="h-30">
    <div
      ref="el"
      p="x-4 y-2"
      border="~ gray-400 rounded"
      shadow="~ hover:lg"
      class="fixed bg-$vt-c-bg select-none cursor-move z-10"
      style="touch-action:none;"
      :style="style"
    >
      👋 Drag me!
      <div class="text-sm opacity-50">
        I am at {{ Math.round(x) }}, {{ Math.round(y) }}
      </div>
    </div>

    <Draggable
      v-slot="{ x, y }"
      p="x-4 y-2"
      border="~ gray-400 rounded"
      shadow="~ hover:lg"
      class="fixed bg-$vt-c-bg select-none cursor-move z-10"
      :initial-value="{ x: innerWidth / 3.9, y: 150 }"
      :prevent-default="true"
      storage-key="vueuse-draggable-pos"
      storage-type="session"
    >
      Renderless component
      <div class="text-xs opacity-50">
        Position persisted in sessionStorage
      </div>
      <div class="text-sm opacity-50">
        {{ Math.round(x) }}, {{ Math.round(y) }}
      </div>
    </Draggable>
  </div>
</template>
