<script setup lang="ts">
import { useCanvas2D, useElementSize, useRafFn } from '@vueuse/core'
import { useTemplateRef, watchEffect } from 'vue'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const { width, height } = useElementSize(canvas, { width: 640, height: 240 })
const { context } = useCanvas2D(canvas, { alpha: false })

watchEffect(() => {
  if (!canvas.value)
    return

  canvas.value.width = width.value
  canvas.value.height = height.value
})

useRafFn(({ timestamp }) => {
  const ctx = context.value
  if (!ctx)
    return

  const radius = Math.min(width.value, height.value) / 5
  const x = width.value / 2 + Math.cos(timestamp / 800) * radius
  const y = height.value / 2 + Math.sin(timestamp / 800) * radius

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width.value, height.value)
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#42b883'
  ctx.fill()
}, { fpsLimit: 30 })
</script>

<template>
  <canvas ref="canvas" border="~ base rounded" block h-60 w-full />
</template>
