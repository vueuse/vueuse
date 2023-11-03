import type { MaybeRefOrGetter } from '@vueuse/shared'
import { computed, toValue } from 'vue-demi'
import type { ComputedRef } from 'vue-demi'
import type { Edge, ShapeConfig, Vertex } from '../types'
import { useShapeBase } from '../useShapeBase'

interface TriangleConfig extends ShapeConfig {
  base?: MaybeRefOrGetter<number>
  height?: MaybeRefOrGetter<number>
}

interface Triangle {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useTriangle(config?: TriangleConfig): Triangle {
  const { center, rotatePoint } = useShapeBase(config)
  const base = config?.base ?? 0
  const height = config?.height ?? 0

  // Vertices
  const vertices = computed(() => {
    const list = []
    list.push(rotatePoint(+(toValue(center).x) - toValue(base) / 2, +(toValue(center).y) + toValue(height) / 2))
    list.push(rotatePoint(+(toValue(center).x) + toValue(base) / 2, +(toValue(center).y) + toValue(height) / 2))
    list.push(rotatePoint(+(toValue(center).x), +(toValue(center).y - toValue(height) / 2)))
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
   * Get the position of a point on the triangle's edge
   * @param percentage
   */
  function getPosition(percentage: MaybeRefOrGetter<number> = 0): { x: number; y: number } {
    const side = Math.floor((toValue(percentage) * 3))
    const localPercentage = (toValue(percentage) * 3) - side
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
