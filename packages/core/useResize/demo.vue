<script setup lang="ts">
import { useToggle } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useResize } from '.'
const element = ref<HTMLElement | null>(null)
const mode = ref<'auto' | 'manual'>('auto')
const [blockingElement, toggleBlockingElement] = useToggle(false)
const { width, height, isOverEdge, direction, isResizing, onResizeStart, onResizeMove, onResizeEnd } = useResize(element, {
  minWidth: 300,
  maxWidth: 'initial',
  minHeight: 'initial',
  maxHeight: 500,
  borderRadius: 8,
  mode,
  // edges: ['bottom-right'],
})

onResizeStart(({ pointer }) => {
  console.log('onResizeStart', pointer)
})
onResizeMove(({ pointer, newWidth, newHeight }) => {
  if (mode.value === 'manual' && element.value) {
    element.value.style.width = `${newWidth}px`
    element.value.style.height = `${newHeight}px`
  }
  console.log('onResizeMove', pointer)
})
onResizeEnd(({ pointer }) => {
  console.log('onResizeEnd', pointer)
})
</script>

<template>
  <div class="relative">
    <div ref="element" class="bg-gray-700 box" :class="[direction]">
      <p>{{ width }} x {{ height }}</p>
      <p>isOverEdge: {{ isOverEdge }}</p>
      <p>isResizing: {{ isResizing }}</p>
      <p>direction: {{ direction }}</p>
      <p>mode: {{ mode }}</p>
    </div>
    <div v-if="blockingElement" class="absolute w-full h-1/2 bg-black/50 inset-0 -m-5 rounded-xl"></div>
  </div>
  <button @click="mode !== 'auto' ? mode = 'auto' : mode = 'manual'">
    {{ mode === 'auto' ? 'Auto Resizing' : 'Custom Resizing' }}
  </button>
  <button @click="toggleBlockingElement()">
    {{ blockingElement ? 'Hide Blocking Element' : 'Show Blocking Element' }}
  </button>
</template>

<style lang="postcss" scoped>
.box {
  transition: box-shadow 150ms ease-in-out;
  background: var(--code-inline-bg-color);
  border-radius: 0.5rem;
  @apply relative p-5;
}
.top-left {
  box-shadow: rgb(0 114 255) 0px -2px 0px 0px,rgb(0 114 255) -2px 0px 0px 0px;
}
.top-right {
  box-shadow: rgb(0 114 255) 0px -2px 0px 0px, rgb(0 114 255) 2px 0px 0px 0px;
}
.bottom-left {
  box-shadow: rgb(0 114 255) 0px 2px 0px 0px, rgb(0 114 255) -2px 0px 0px 0px;
}
.bottom-right {
  box-shadow: rgb(0 114 255) 0px 2px 0px 0px, rgb(0 114 255) 2px 0px 0px 0px;
}
.bottom {
  box-shadow: rgb(0 114 255) 0px 2px 0px 0px;
}
.top {
  box-shadow: rgb(0 114 255) 0px -2px 0px 0px;
}
.left {
  box-shadow: rgb(0 114 255) -2px 0px 0px 0px;
}
.right {
  box-shadow: rgb(0 114 255) 2px 0px 0px 0px;
}
</style>
