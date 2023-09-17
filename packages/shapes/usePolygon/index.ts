import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { Edge, ShapeConfig, Vertex } from '../types'
import { useShapeBase } from '../useShapeBase'

interface PolygonConfig extends ShapeConfig {
  sides?: MaybeRefOrGetter<number>
  sideLength?: MaybeRefOrGetter<number>
}

interface Polygon {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function usePolygon(config?: PolygonConfig): Polygon {
  const {
    center,
    rotatePoint,
  } = useShapeBase(config)
  const sideLength = config?.sideLength ?? 0
  const sides = config?.sides ?? 3

  const angleStep = computed(() => (Math.PI * 2) / toValue(sides))

  // Vertices
  const vertices = computed(() => {
    const list = []
    const isEven = toValue(sides) % 2 === 0
    let initialRotation: number

    if (isEven) {
      // if the polygon has an even number of sides, we rotate the polygon to start at 3 o'clock (flat side on x-axis).
      initialRotation = -Math.PI / 2 + angleStep.value / 2
    }
    else {
      // if the polygon has an odd number of sides, we rotate the polygon to start at 12 o'clock (corner on x-axis).
      initialRotation = -Math.PI / 2
    }

    for (let i = 0; i < toValue(sides); i++) {
      list.push(rotatePoint(
        +(toValue(center).x) + toValue(sideLength) * Math.cos(initialRotation + angleStep.value * i),
        +(toValue(center).y) + toValue(sideLength) * Math.sin(initialRotation + angleStep.value * i),
      ))
    }

    return list
  })

  // Edges
  const edges = computed(() => {
    const edgeList = []
    for (let i = 0; i < vertices.value.length; i++) {
      edgeList.push({
        from: vertices.value[i],
        to: vertices.value[(i + 1) % vertices.value.length],
      })
    }
    return edgeList
  })

  /**
   * Get the position of a point on the polygon's edge
   * @param percentage
   */
  function getPosition(percentage: MaybeRefOrGetter<number> = 0): { x: number; y: number } {
    const side = Math.floor((toValue(percentage) * toValue(sides)))
    const localPercentage = (toValue(percentage) * toValue(sides)) - side
    const startVertex = vertices.value[side]
    const endVertex = vertices.value[(side + 1) % vertices.value.length]

    const x = startVertex.x + localPercentage * (endVertex.x - startVertex.x)
    const y = startVertex.y + localPercentage * (endVertex.y - startVertex.y)

    return {
      x: +(x).toFixed(10),
      y: +(y).toFixed(10),
    }
  }

  return {
    getPosition,
    vertices,
    edges,
  }
}
