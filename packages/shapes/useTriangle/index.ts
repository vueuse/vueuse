import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { Edge, ShapeConfig, Vertex } from '../types'
import { useShapeBase } from '../useShapeBase'

interface TriangleConfig extends ShapeConfig {
  sideLength?: MaybeRefOrGetter<number>
}

interface Triangle {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useTriangle(config?: TriangleConfig): Triangle {
  // Configuration
  const {
    center,
    rotatePoint,
  } = useShapeBase(config)
  const sideLength = config?.sideLength ?? 0
  const halfSide = computed(() => +(toValue(sideLength)) / 2)
  const height = computed(() => (Math.sqrt(3) / 2) * +(toValue(sideLength)))

  // Vertices
  const vertices = computed(() => {
    const rotateCenter = {
      x: +(toValue(center).x),
      y: (-height.value / 3) + +(toValue(center).y),
    }
    const points = [
      {
        x: 0,
        y: -height.value / 3,
      },
      {
        x: -halfSide.value,
        y: height.value * 2 / 3,
      },
      {
        x: halfSide.value,
        y: height.value * 2 / 3,
      },
    ]
    return points.map((point) => {
      const rotatedPoint = rotatePoint(point.x + rotateCenter.x, point.y + rotateCenter.y)
      return {
        x: rotatedPoint.x + +(toValue(center).x),
        y: rotatedPoint.y + (height.value / 6) + +(toValue(center).y),
      }
    })
  })

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
      to: vertices.value[0],
    },
  ])

  /**
   * Get the position of a point on the triangle
   * @param percentage
   */
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
