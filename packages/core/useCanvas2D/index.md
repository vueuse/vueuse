---
category: Browser
related: useElementSize, useRafFn
---

# useCanvas2D

Reactive 2D rendering context for a canvas element.

## Usage

```vue
<script setup lang="ts">
import { useCanvas2D } from '@vueuse/core'
import { useTemplateRef, watchEffect } from 'vue'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const { context } = useCanvas2D(canvas, { alpha: false })

watchEffect(() => {
  const ctx = context.value
  if (!ctx)
    return

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, 100, 100)
})
</script>

<template>
  <canvas ref="canvas" />
</template>
```

### Return Values

| Property  | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| `context` | The current `CanvasRenderingContext2D`, or `null` when unavailable. |

### Options

The second argument is passed to [`HTMLCanvasElement.getContext()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext) as `CanvasRenderingContext2DSettings`.

```ts
const { context } = useCanvas2D(canvas, {
  alpha: false,
  willReadFrequently: true,
})
```
