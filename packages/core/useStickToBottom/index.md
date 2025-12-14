---
category: Sensors
---

# useStickToBottom

Stick a scroll container to the bottom, designed for chat/message UIs.

## Support

This composable uses `ResizeObserver` to react to content size changes. You can check `isSupported` to know if it is available in the current environment.

## Usage

```vue
<script setup lang="ts">
import { useStickToBottom } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const scrollEl = useTemplateRef<HTMLElement>('scrollEl')
const contentEl = useTemplateRef<HTMLElement>('contentEl')

const {
  isSupported,
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

  <p v-if="!isSupported" style="opacity: 0.7">
    ResizeObserver is not supported in this environment.
  </p>
</template>
```

## Credits

This composable is inspired by the React hook [use-stick-to-bottom](https://github.com/stackblitz-labs/use-stick-to-bottom) by StackBlitz Labs contributors.
