---
category: Browser
---

# useCanvas2D

Reactive [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). The Canvas API provides a means for drawing graphics via JavaScript and the HTML `<canvas>` element. Among other things, it can be used for animation, game graphics, data visualization, photo manipulation, and real-time video processing.

**N.B.** The Canvas API largely focuses on 2D graphics and this composable is designed for specific usage with the 2-dimensional canvas rendering context. 

**N.B.** The WebGL API, which also uses the `<canvas>` element, draws hardware-accelerated 2D and 3D graphics is not covered by this composable.

## Usage

```vue
<template>
  <canvas ref="canvas" class="h-128 w-128"></canvas>
</template>
```

```ts
import { useCanvas2D, useRafFn } from '@vueuse/core'

const bound = ref<null | HTMLElement>(null)

// This is the canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

// Get the ctx:
const { ctx } = useCanvas2D(canvas, bound, { alpha: true, desynchronized: false })

useRafFn(() => {
  if (ctx.value) {
    // do something with the context ...
  }
})
```

```vue
<template>
  <div ref="bound" class="w-full h-128 sm:w-128 lg:w-256">
    <canvas ref="canvas"></canvas>
  </div>
</template>
```

For more on canvas 2D context attributes, please see [CanvasRenderingContext2D.getContextAttributes()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getContextAttributes) on Mozilla Docs.
