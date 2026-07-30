---
category: Elements
---

# useScrollbarWidth

Reactively report the scrollbar width of an HTML element.

Computed as `offsetWidth - clientWidth`. Recomputes on element resize and on window resize (catches zoom changes). Returns `0` when the target is unmounted, has no scrollbar, or the browser uses overlay scrollbars (Safari, mobile).

## Usage

```vue
<script setup lang="ts">
import { useScrollbarWidth } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const scrollbarWidth = useScrollbarWidth(el)
</script>

<template>
  <div ref="el" style="overflow: auto; height: 200px;">
    <!-- scrollable content -->
  </div>
  <p>Scrollbar gutter: {{ scrollbarWidth }}px</p>
</template>
```

Useful when laying out content that needs to compensate for the gutter Chrome/Firefox/Edge reserve for scrollbars (overlay-scrollbar browsers report `0` and the layout naturally fills the space).
