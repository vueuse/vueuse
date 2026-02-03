<script setup lang="ts">
import { computed, ref as deepRef, useTemplateRef } from 'vue'
import { useStickToBottom } from './index'

const viewport = useTemplateRef<HTMLElement>('viewport')
const content = useTemplateRef<HTMLElement>('content')

const items = deepRef<string[]>(Array.from({ length: 30 }, (_, i) => `Message #${i + 1}`))

const {
  escapedFromLock,
  isAtBottom,
  showScrollToBottom,
  scrollToBottomAndResume,
  stopScroll,
} = useStickToBottom({
  scrollElement: viewport,
  contentElement: content,
  resize: 'smooth',
  initial: 'instant',
})

function addMessage() {
  items.value.push(`Message #${items.value.length + 1}`)
}

const statusText = computed(() => {
  if (isAtBottom.value)
    return 'At bottom'
  if (escapedFromLock.value)
    return 'Paused (escaped)'
  return 'Not at bottom'
})
</script>

<template>
  <div class="flex gap-2 items-center mb-2">
    <button class="btn" @click="addMessage">
      Add message
    </button>
    <button class="btn" @click="stopScroll">
      Stop (escape)
    </button>
    <span class="text-sm op-70">{{ statusText }}</span>

    <button v-if="showScrollToBottom" class="btn ml-auto" @click="scrollToBottomAndResume(true)">
      Scroll to bottom
    </button>
  </div>

  <div
    ref="viewport"
    class="border rounded p-2"
    style="height: 240px; overflow: auto"
  >
    <div ref="content" class="flex flex-col gap-2">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="border rounded px-2 py-1"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
