import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { Edge, ShapeConfig, Vertex } from '../types'
import { useShapeBase } from '../useShapeBase'

interface RectangleConfig extends ShapeConfig {
  width?: MaybeRefOrGetter<number>
  height?: MaybeRefOrGetter<number>
}

interface Rectangle {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useRectangle(config?: RectangleConfig): Rectangle {
  // Configuration
  const {
    center,
    rotatePoint,
  } = useShapeBase(config)
  const width = config?.width ?? 0
  const height = config?.height ?? 0
  const halfWidth = computed(() => +(toValue(width)) / 2)
  const halfHeight = computed(() => +(toValue(height)) / 2)

  // Vertices
  const vertices = computed(() => [
    rotatePoint(+(toValue(center).x) - halfWidth.value, +(toValue(center).y) - halfHeight.value),
    rotatePoint(+(toValue(center).x) + halfWidth.value, +(toValue(center).y) - halfHeight.value),
    rotatePoint(+(toValue(center).x) + halfWidth.value, +(toValue(center).y) + halfHeight.value),
    rotatePoint(+(toValue(center).x) - halfWidth.value, +(toValue(center).y) + halfHeight.value),
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
   * Get the position of a point on the rectangle
   * @param percentage
   */
  function getPosition(percentage: MaybeRefOrGetter<number> = 0): { x: number; y: number } {
    const perimeter = (toValue(width) + toValue(height)) * 2
    const pointPosition = toValue(percentage) * perimeter
    let x: number, y: number

    if (pointPosition <= toValue(height)) {
      x = vertices.value[0].x + pointPosition
      y = vertices.value[0].y
    }
    else if (pointPosition <= (toValue(height) + toValue(width))) {
      x = vertices.value[1].x
      y = vertices.value[1].y + (pointPosition - toValue(height))
    }
    else if (pointPosition <= (toValue(height) * 2 + toValue(width))) {
      x = vertices.value[2].x - (pointPosition - toValue(height) - toValue(width))
      y = vertices.value[2].y
    }
    else {
      x = vertices.value[3].x
      y = vertices.value[3].y - (pointPosition - toValue(height) * 2 - toValue(width))
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
