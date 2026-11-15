---
category: Elements
---

# useElementSize

Reactive size of an HTML element. [ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

## Usage

```vue
<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { width, height } = useElementSize(el)
</script>

<template>
  <div ref="el">
    Height: {{ height }}
    Width: {{ width }}
  </div>
</template>
```

### Initial values

Before the element is measured (e.g. during SSR), `width` and `height` are `0`. Set your own initial values with `initials`:

```ts
import { useElementSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { width, height } = useElementSize(el, {
  initials: { width: 300, height: 200 },
})
```

The returned refs are readonly. To own the state, pass your own refs to `initials`, `useElementSize` writes into them.

## Component Usage

```vue
<template>
  <UseElementSize v-slot="{ width, height }">
    Width: {{ width }} Height: {{ height }}
  </UseElementSize>
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import { vElementSize } from '@vueuse/components'

function onResize({ width, height }: { width: number, height: number }) {
  console.log(width, height)
}
</script>

<template>
  <textarea v-element-size="onResize" />
  <!-- with options -->
  <textarea v-element-size="[onResize, { box: 'content-box', initials: { width: 100, height: 100 } }]" />
</template>
```
