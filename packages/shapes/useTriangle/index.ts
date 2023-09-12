import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { Edge, Vertex } from '../types'

interface Triangle {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useTriangle(sideLength: MaybeRefOrGetter<number> = 0, center: MaybeRefOrGetter<{
  x: number
  y: number
}> = { x: 0, y: 0 }): Triangle {
  const halfSide = computed(() => +(toValue(sideLength)) / 2)
  const height = computed(() => (Math.sqrt(3) / 2) * +(toValue(sideLength)))

  const vertices = computed(() => [
    { x: +(toValue(center).x), y: +(toValue(center).y) - height.value / 2 },
    { x: +(toValue(center).x) - halfSide.value, y: +(toValue(center).y) + height.value / 2 },
    { x: +(toValue(center).x) + halfSide.value, y: +(toValue(center).y) + height.value / 2 },
  ])

  const edges = computed(() => [
    { from: vertices.value[0], to: vertices.value[1] },
    { from: vertices.value[1], to: vertices.value[2] },
    { from: vertices.value[2], to: vertices.value[0] },
  ])

  function getPosition(percentage: MaybeRefOrGetter<number> = 0): { x: number; y: number } {
    const sideLengthValue = toValue(sideLength)
    const perimeter = 3 * sideLengthValue
    const pointPosition = toValue(percentage) * perimeter
    let x: number
    let y: number

    if (pointPosition <= sideLengthValue) {
      // Base edge
      x = vertices.value[0].x + pointPosition
      y = vertices.value[0].y
    }
    else if (pointPosition <= 2 * sideLengthValue) {
      // Left edge
      x = vertices.value[1].x - (pointPosition - sideLengthValue)
      y = vertices.value[1].y
    }
    else {
      // Right edge
      x = vertices.value[2].x + (pointPosition - 2 * sideLengthValue)
      y = vertices.value[2].y
    }

    return { x: +(x).toFixed(10), y: +(y).toFixed(10) }
  }

  return {
    getPosition,
    vertices,
    edges,
  }
}
