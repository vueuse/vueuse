import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { Edge, Vertex } from '../types'

interface SquareConfig {
  sideLength?: MaybeRefOrGetter<number>
  center?: MaybeRefOrGetter<{ x: number; y: number }>
  rotation?: MaybeRefOrGetter<number>
}

interface Square {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useSquare(config?: SquareConfig): Square {
  const sideLength = config?.sideLength ?? 0
  const center = config?.center ?? { x: 0, y: 0 }
  const rotation = config?.rotation ?? 0

  const halfSize = computed(() => +(toValue(sideLength)) / 2)

  const rotatePoint = (x: number, y: number) => {
    const dx = x - +(toValue(center).x)
    const dy = y - +(toValue(center).y)
    return {
      x: +(toValue(center).x) + dx * Math.cos(toValue(rotation) * (Math.PI / 180)) - dy * Math.sin(toValue(rotation) * (Math.PI / 180)),
      y: +(toValue(center).y) + dx * Math.sin(toValue(rotation) * (Math.PI / 180)) + dy * Math.cos(toValue(rotation) * (Math.PI / 180)),
    }
  }

  const vertices = computed(() => [
    rotatePoint(+(toValue(center).x) - halfSize.value, +(toValue(center).y) - halfSize.value),
    rotatePoint(+(toValue(center).x) + halfSize.value, +(toValue(center).y) - halfSize.value),
    rotatePoint(+(toValue(center).x) + halfSize.value, +(toValue(center).y) + halfSize.value),
    rotatePoint(+(toValue(center).x) - halfSize.value, +(toValue(center).y) + halfSize.value),
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
    let x: number, y: number

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

    // Rotate the point
    const rotatedPoint = rotatePoint(x, y)
    return { x: +(rotatedPoint.x).toFixed(10), y: +(rotatedPoint.y).toFixed(10) }
  }

  return {
    getPosition,
    vertices,
    edges,
  }
}
