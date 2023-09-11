import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { Edge, Vertex } from '../types'

interface Square {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useSquare(sideLength: MaybeRefOrGetter<number> = 0, center: MaybeRefOrGetter<{
  x: number
  y: number
}> = { x: 0, y: 0 }): Square {
  const halfSize = computed(() => +(toValue(sideLength)) / 2)

  const vertices = computed(() => [
    { x: +(toValue(center).x) - halfSize.value, y: +(toValue(center).y) - halfSize.value },
    { x: +(toValue(center).x) + halfSize.value, y: +(toValue(center).y) - halfSize.value },
    { x: +(toValue(center).x) + halfSize.value, y: +(toValue(center).y) + halfSize.value },
    { x: +(toValue(center).x) - halfSize.value, y: +(toValue(center).y) + halfSize.value },
  ])

  const edges = computed(() => [
    { from: vertices.value[0], to: vertices.value[1] },
    { from: vertices.value[1], to: vertices.value[2] },
    { from: vertices.value[2], to: vertices.value[3] },
    { from: vertices.value[3], to: vertices.value[0] },
  ])

  function getPosition(percentage: MaybeRefOrGetter<number> = 0): { x: number; y: number } {
    const perimeter = toValue(sideLength) * 4
    const pointPosition = toValue(percentage) * perimeter
    let x: number
    let y: number

    if (pointPosition <= toValue(sideLength)) {
      // Top edge
      x = vertices.value[0].x + pointPosition
      y = vertices.value[0].y
    }
    else if (pointPosition <= toValue(sideLength) * 2) {
      // Right edge
      x = vertices.value[1].x
      y = vertices.value[1].y + (pointPosition - toValue(sideLength))
    }
    else if (pointPosition <= toValue(sideLength) * 3) {
      // Bottom edge
      x = vertices.value[2].x - (pointPosition - toValue(sideLength) * 2)
      y = vertices.value[2].y
    }
    else {
      // Left edge
      x = vertices.value[3].x
      y = vertices.value[3].y - (pointPosition - toValue(sideLength) * 3)
    }

    return { x: +(x).toFixed(10), y: +(y).toFixed(10) }
  }

  return {
    getPosition,
    vertices,
    edges,
  }
}
