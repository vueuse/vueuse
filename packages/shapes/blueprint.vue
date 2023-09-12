<script lang="ts" setup>
import { onBeforeUnmount, ref, toRefs } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'
import type { Edge, Vertex } from './types'

const props = defineProps<{
  vertices: Array<Vertex>
  edges: Array<Edge>
}>()
const canvas = ref<HTMLCanvasElement | null>(null)
let animationId: number

const {
  vertices,
  edges,
} = toRefs(props)

tryOnMounted(() => {
  const dpi = window.devicePixelRatio
  const ctx = canvas.value?.getContext('2d')
  const style_height = +getComputedStyle(canvas.value!).getPropertyValue('height').slice(0, -2)
  const style_width = +getComputedStyle(canvas.value!).getPropertyValue('width').slice(0, -2)

  // now scale the canvas
  canvas.value!.setAttribute('height', String(style_height * dpi))
  canvas.value!.setAttribute('width', String(style_width * dpi))

  const width = canvas.value!.width
  const height = canvas.value!.height
  const centerX = width / 2
  const centerY = height / 2

  let lastRenderTime = 0

  function draw(t: number) {
    const dt = t - lastRenderTime

    if (dt < 1000 / 120) {
      animationId = requestAnimationFrame(draw)
      return
    }

    ctx.clearRect(0, 0, width, height)

    // Draw semi-transparent face
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.moveTo(Math.round(centerX + vertices.value[0].x), Math.round(centerY + vertices.value[0].y))
    for (let i = 1; i < vertices.value.length; i++)
      ctx.lineTo(Math.round(centerX + vertices.value[i].x), Math.round(centerY + vertices.value[i].y))

    ctx.closePath()
    ctx.fill()

    // Draw vertices
    for (const vertex of vertices.value) {
      ctx.beginPath()
      ctx.fillStyle = '#114d32'
      ctx.arc(Math.round(centerX + vertex.x), Math.round(centerY + vertex.y), 8, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.fillStyle = '#114d32'
      ctx.font = 'bold 18px Inter'
      ctx.fillText(`${Math.round(vertex.x)}, ${Math.round(vertex.y)}`, Math.round(centerX + vertex.x + 18), Math.round(centerY + vertex.y - 18))
    }

    // Draw edges
    for (const edge of edges.value) {
      ctx.beginPath()
      ctx.moveTo(Math.round(centerX + edge.from.x), Math.round(centerY + edge.from.y))
      ctx.lineTo(Math.round(centerX + edge.to.x), Math.round(centerY + edge.to.y))
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
    }

    lastRenderTime = t
    animationId = requestAnimationFrame(draw)
  }

  animationId = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
canvas {
  width: 500px;
  height: 300px;
  border-radius: 8px;
  background: #44bd87;
}
</style>
