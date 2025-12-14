---
category: Sensors
---

# useStickToBottom

Stick a scroll container to the bottom, designed for chat/message UIs.

## Usage

```vue
<script setup lang="ts">
import { useStickToBottom } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const scrollEl = useTemplateRef<HTMLElement>('scrollEl')
const contentEl = useTemplateRef<HTMLElement>('contentEl')

const {
  showScrollToBottom,
  scrollToBottomAndResume,
} = useStickToBottom({
  scrollElement: scrollEl,
  contentElement: contentEl,
  initial: 'instant',
  resize: 'smooth',
})
</script>

<template>
  <div ref="scrollEl" style="height: 240px; overflow: auto; border: 1px solid var(--vp-c-divider)">
    <div ref="contentEl">
      <!-- messages -->
    </div>
  </div>

  <button v-if="showScrollToBottom" @click="scrollToBottomAndResume(true)">
    Scroll to bottom
  </button>
</template>
```

## Credits

This composable is inspired by the React hook [use-stick-to-bottom](https://github.com/stackblitz-labs/use-stick-to-bottom) by StackBlitz Labs contributors.
