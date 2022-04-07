---
category: Browser
---

# useCanvasContext

Reactive [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). The Canvas API provides a means for drawing graphics via JavaScript and the HTML `<canvas>` element. Among other things, it can be used for animation, game graphics, data visualization, photo manipulation, and real-time video processing.

**N.B.** The Canvas API largely focuses on 2D graphics and this composable is designed for specific usage with the 2-dimensional canvas rendering context. 

**N.B.** The WebGL API, which also uses the `<canvas>` element, draws hardware-accelerated 2D and 3D graphics.

## Usage

This is the default usage of useCanvasContext, which simply returns the context for the specified attributes.

```vue
<template>
  <canvas ref="canvas" class="h-128 w-full sm:w-128 lg:w-256" />
</template>
```

```ts
import { useCanvasContext, useElementBounding, useRafFn } from '@vueuse/core'

// This is the canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

// Get the ctx:
const { ctx } = useCanvasContext(canvas)

useRafFn(() => {
  if (ctx.value) {
    // do something with the context ...
  }
})
```

## Bounding Element Example

Sometime's it's useful to have a canvas element that will be reactive to it's bounding element or parent element, and adjust it's height and width reactively to those changes.

```vue
<template>
  <div ref="bound" class="h-128 w-full sm:w-128 lg:w-256">
    <canvas ref="canvas" />
  </div>
</template>
```

```ts
import { useCanvasContext, useElementBounding, useRafFn } from '@vueuse/core'

const bound = ref<null | HTMLElement>(null)

// This is the canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

// Get the ctx:
const { ctx } = useCanvasContext(canvas)

// Obtain the bounding element's width and height:
const { width, height } = useElementBounding(bound)

// Watch for changes to the bounding element's
watchEffect(() => {
  if (!canvas.value)
    return
  canvas.value.width = width.value
  canvas.value.height = height.value
})

useRafFn(() => {
  if (ctx.value) {
    // do something with the context ...
  }
})
```

For more on canvas 2D context attributes, please see [CanvasRenderingContext2D.getContextAttributes()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getContextAttributes) on Mozilla Docs.
