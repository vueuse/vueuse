<script setup lang="ts">
import { useToggle } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useResize } from '.'
const element = ref<HTMLElement | null>(null)
const [resize, toggle] = useToggle(true)
const [blockingElement, toggleBlockingElement] = useToggle(false)
const { width, height, isReady, direction, isResizing, onResizeStart, onResizeMove, onResizeEnd } = useResize(element, {
  minWidth: 300,
  maxWidth: 'initial',
  minHeight: 'initial',
  maxHeight: 500,
  resize,
  borderRadius: 8,
  // edges: ['bottom-right'],
})

onResizeStart(({ pointer }) => {
  console.log('onResizeStart', pointer)
})
onResizeMove(({ pointer, newWidth, newHeight }) => {
  if (!resize.value && element.value) {
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
  <div ref="element" class="bg-gray-700 box relative" :class="[direction]">
    <p>{{ width }} x {{ height }}</p>
    <p>isReady: {{ isReady }}</p>
    <p>isResizing: {{ isResizing }}</p>
    <p>direction: {{ direction }}</p>
    <p>resize: {{ resize }}</p>
    <div v-if="blockingElement" class="absolute w-full h-1/2 bg-black/50 inset-0 -m-5 rounded-xl"></div>
  </div>
  <button @click="toggle()">
    {{ resize ? 'Auto Resizing' : 'Custom Resizing' }}
  </button>
  <button @click="toggleBlockingElement()">
    {{ blockingElement ? 'Hide Blocking Element' : 'Show Blocking Element' }}
  </button>
</template>

<style scoped>
.box {
  transition: box-shadow 150ms ease-in-out;
  background: var(--code-inline-bg-color);
  @apply relative p-5 rounded-lg;
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
