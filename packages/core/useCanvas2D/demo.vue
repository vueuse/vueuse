<script setup lang="ts">
import { computed, reactive, ref } from 'vue-demi'
import YAML from 'js-yaml'
import { useRafFn } from '../useRafFn'
import { useCanvas2D } from '.'

// Be sure to specify a bounding parent element:
const bound = ref<null | HTMLElement>(null)

// This is the canvas HTMLCanvasElement element as a ref:
const canvas = ref<null | HTMLCanvasElement>(null)

const {
  ctx,
  width,
  height,
} = useCanvas2D(canvas, bound, { alpha: false })

const properties = computed(() => YAML.dump(
  reactive({
    width,
    height,
  }),
))

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
