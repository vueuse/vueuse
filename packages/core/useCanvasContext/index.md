---
category: Browser
---

# useCanvas2D

Reactive [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). The Canvas API provides a means for drawing graphics via JavaScript and the HTML `<canvas>` element. Among other things, it can be used for animation, game graphics, data visualization, photo manipulation, and real-time video processing.

**N.B.** The Canvas API largely focuses on 2D graphics and this composable is designed for specific usage with the 2-dimensional canvas rendering context. 

**N.B.** The WebGL API, which also uses the `<canvas>` element, draws hardware-accelerated 2D and 3D graphics is not covered by this composable.

## Usage

This is the default usage of useCanvas2D, which simply returns the context for the specified attributes.

## 2D Canvas Context

```vue
<template>
  <canvas ref="canvas" class="w-full h-128 sm:w-128 lg:w-256" />
</template>
```

```ts
import { useCanvasContext, useElementBounding, useRafFn } from '@vueuse/core'

// This is the canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

// Get the ctx:
const { ctx, isCanvasRenderingContext2D } = useCanvasContext(canvas, '2d', { alpha: false })

useRafFn(() => {
  if (ctx.value && isCanvasRenderingContext2D(ctx.value)) {
    // do something with the context ...
  }
})
```

## 3D WebGL Context

```vue
<template>
  <canvas ref="canvas" class="w-full h-128 sm:w-128 lg:w-256" />
</template>
```

```ts
import { useCanvasContext, useElementBounding, useRafFn } from '@vueuse/core'

// This is the canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

// Get the ctx:
const { ctx, isCanvasRenderingContextWebGL } = useCanvasContext(canvas, 'webgl', { alpha: false })

useRafFn(() => {
  if (ctx.value && isCanvasRenderingContextWebGL(ctx.value)) {
    // do something with the context ...
  }
})
```

## Bounding Element Example

Sometime's it's useful to have a canvas element that will be reactive to it's bounding element or parent element, and adjust it's height and width reactively to those changes.

```vue
<template>
  <div ref="bound" class="w-full h-128 sm:w-128 lg:w-256">
    <canvas ref="canvas" />
  </div>
</template>
```

```ts
import { useCanvas2D, useElementBounding, useRafFn } from '@vueuse/core'

const bound = ref<null | HTMLElement>(null)

// This is the canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

// Get the ctx:
const { ctx } = useCanvas2D(canvas, { alpha: true, desynchronized: false })

// Obtain the bounding element's width and height:
const { width, height } = useElementBounding(bound)

// Watch for changes to the bounding element's width:
watch(width, (widthValue) => {
  if (!canvas.value)
    return
  canvas.value.width = widthValue
})

// Watch for changes to the bounding element's height:
watch(height, (heightValue) => {
  if (!canvas.value)
    return
  canvas.value.height = heightValue
})

useRafFn(() => {
  if (ctx.value) {
    // do something with the context ...
  }
})
```

For more on canvas 2D context attributes, please see [CanvasRenderingContext2D.getContextAttributes()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getContextAttributes) on Mozilla Docs.
