import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { Edge, ShapeConfig, Vertex } from '../types'
import { useShapeBase } from '../useShapeBase'

interface SquareConfig extends ShapeConfig {
  sideLength?: MaybeRefOrGetter<number>
}

interface Square {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useSquare(config?: SquareConfig): Square {
  // Configuration
  const {
    center,
    rotatePoint,
  } = useShapeBase(config)
  const sideLength = config?.sideLength ?? 0
  const halfSize = computed(() => +(toValue(sideLength)) / 2)

  // Vertices
  const vertices = computed(() => [
    rotatePoint(+(toValue(center).x) - halfSize.value, +(toValue(center).y) - halfSize.value),
    rotatePoint(+(toValue(center).x) + halfSize.value, +(toValue(center).y) - halfSize.value),
    rotatePoint(+(toValue(center).x) + halfSize.value, +(toValue(center).y) + halfSize.value),
    rotatePoint(+(toValue(center).x) - halfSize.value, +(toValue(center).y) + halfSize.value),
  ])

  // Edges
  const edges = computed(() => [
    {
      from: vertices.value[0],
      to: vertices.value[1],
    },
    {
      from: vertices.value[1],
      to: vertices.value[2],
    },
    {
      from: vertices.value[2],
      to: vertices.value[3],
    },
    {
      from: vertices.value[3],
      to: vertices.value[0],
    },
  ])

  /**
   * Get the position of a point on the square
   * @param percentage
   */
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
    return {
      x: +(rotatedPoint.x).toFixed(10),
      y: +(rotatedPoint.y).toFixed(10),
    }
  }

  return {
    getPosition,
    vertices,
    edges,
  }
}
