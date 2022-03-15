<script setup lang="ts">
import { reactive, ref, watch } from 'vue-demi'
import { stringify } from '@vueuse/docs-utils'
import { useRafFn } from '../useRafFn'
import { useElementBounding } from '../useElementBounding'
import { useCanvas2D } from '.'

// Provide a bounding parent element:
const bound = ref<null | HTMLElement>(null)

// Canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

// Obtain the element bounding:
const { width, height } = useElementBounding(bound)

watch(width, (widthValue) => {
  if (!canvas.value) return
  canvas.value.width = widthValue
})

watch(height, (heightValue) => {
  if (!canvas.value) return
  canvas.value.height = heightValue
})

const { ctx } = useCanvas2D(canvas, { alpha: false })

const properties = stringify(reactive({
  width,
  height,
}))

useRafFn(() => {
  if (ctx.value) {
    const centerX = width.value / 2
    const centerY = height.value / 2

    const radius = Math.min(height.value, width.value) / 4

    ctx.value.fillStyle = '#fff'
    ctx.value.fillRect(0, 0, width.value, height.value)
    ctx.value.beginPath()
    ctx.value.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    ctx.value.fillStyle = '#fff'
    ctx.value.fill()
    ctx.value.lineWidth = 2
    ctx.value.strokeStyle = '#000'
    ctx.value.stroke()
  }
})
</script>

<template>
  <div ref="bound" class="w-full h-128">
    <canvas ref="canvas" />
  </div>

  <pre lang="yaml">{{ properties }}</pre>
</template>
