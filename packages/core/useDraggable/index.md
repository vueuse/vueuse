---
category: Elements
---

# useDraggable

Make elements draggable.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
})
</script>

<template>
  <div ref="el" :style="style" style="position: fixed">
    Drag me! I am at {{ x }}, {{ y }}
  </div>
</template>
```

## Component Usage

```vue
<template>
  <UseDraggable v-slot="{ x, y }" :initial-value="{ x: 10, y: 10 }">
    Drag me! I am at {{ x }}, {{ y }}
  </UseDraggable>
</template>
```

For component usage, additional props `storageKey` and `storageType` can be passed to the component and enable the persistence of the element position.

```vue
<template>
  <UseDraggable storage-key="vueuse-draggable" storage-type="session">
    Refresh the page and I am still in the same position!
  </UseDraggable>
</template>
```
