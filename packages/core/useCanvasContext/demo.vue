<script setup lang="ts">
import { reactive, ref, unref, watchEffect } from 'vue-demi'
import { stringify } from '@vueuse/docs-utils'
import { useRafFn } from '../useRafFn'
import { useElementBounding } from '../useElementBounding'
import { useCanvasContext } from '.'

// Provide a bounding parent element:
const bound = ref<null | HTMLElement>(null)

// Canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

// Obtain the element bounding:
const { width, height } = useElementBounding(bound)

watchEffect(() => {
  if (!canvas.value)
    return
  canvas.value.width = width.value
  canvas.value.height = height.value
})

const { ctx } = useCanvasContext(canvas, '2d')

const properties = stringify(reactive({
  width,
  height,
}))

useRafFn(() => {
  if (ctx.value) {
    const _ctx = unref(ctx.value)
    const centerX = width.value / 2
    const centerY = height.value / 2
    const radius = Math.min(height.value, width.value) / 4
    _ctx.fillStyle = '#fff'
    _ctx.fillRect(0, 0, width.value, height.value)
    _ctx.beginPath()
    _ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    _ctx.fillStyle = '#fff'
    _ctx.fill()
    _ctx.lineWidth = 2
    _ctx.strokeStyle = '#000'
    _ctx.stroke()
  }
})
</script>

<template>
  <div ref="bound" class="h-128 w-full">
    <canvas ref="canvas" />
  </div>

  <pre lang="yaml">{{ properties }}</pre>
</template>
