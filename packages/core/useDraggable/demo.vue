<script setup lang="ts">
import { UseDraggable as Draggable } from '@vueuse/components'
import { isClient, useDraggable } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const handle = useTemplateRef('handle')

const innerWidth = isClient ? window.innerWidth : 200

const disabled = shallowRef(false)
const { x, y, style } = useDraggable(el, {
  initialValue: { x: innerWidth / 4.2, y: 80 },
  preventDefault: true,
  disabled,
})
</script>

<template>
  <div>
    <div class="text-xs">
      <label class="checkbox">
        <input
          :checked="disabled" type="checkbox" name="enabled"
          @input="($event.target as HTMLInputElement)!.checked ? disabled = true : disabled = false "
        >
        <span>Disabled drag and drop</span>
      </label>
    </div>
    <p class="italic op50 text-center">
      Check the floating boxes
    </p>
    <div
      ref="el"
      p="x-4 y-2"
      border="~ gray-800/30 rounded"
      shadow="~ hover:lg"
      class="fixed bg-$vp-c-bg select-none cursor-move z-31"
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
      border="~ gray-400/30 rounded"
      shadow="~ hover:lg"
      class="fixed bg-$vp-c-bg select-none cursor-move z-31"
      :initial-value="{ x: innerWidth / 3.9, y: 150 }"
      prevent-default
      storage-key="vueuse-draggable-pos"
      storage-type="session"
      :disabled="disabled"
    >
      Renderless component
      <div class="text-xs opacity-50">
        Position persisted in sessionStorage
      </div>
      <div class="text-sm opacity-50">
        {{ Math.round(x) }}, {{ Math.round(y) }}
      </div>
    </Draggable>

    <Draggable
      v-slot="{ x, y }"
      p="x-4 y-2"
      border="~ gray-400/30 rounded"
      shadow="~ hover:lg"
      class="fixed bg-$vp-c-bg select-none z-31"
      :initial-value="{ x: innerWidth / 3.6, y: 240 }"
      :prevent-default="true"
      :handle="handle"
      :disabled="disabled"
    >
      <div ref="handle" class="cursor-move">
        👋 Drag here!
      </div>
      <div class="text-xs opacity-50">
        Handle that triggers the drag event
      </div>
      <div class="text-sm opacity-50">
        I am at {{ Math.round(x) }}, {{ Math.round(y) }}
      </div>
    </Draggable>

    <Draggable
      v-slot="{ x, y }"
      p="x-4 y-2"
      border="~ gray-400/30 rounded"
      shadow="~ hover:lg"
      class="fixed bg-$vp-c-bg select-none cursor-move z-31"
      :initial-value="{ x: innerWidth / 3.3, y: 330 }"
      prevent-default
      :disabled="disabled"
      :capture="false"
    >
      Not Use Captured Element
      <div class="text-xs opacity-50 cursor-default" @pointerdown.stop>
        Dragging here will not work
      </div>
      <div class="text-sm opacity-50">
        {{ Math.round(x) }}, {{ Math.round(y) }}
      </div>
    </Draggable>
  </div>
</template>
