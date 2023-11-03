import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { Edge, ShapeConfig, Vertex } from '../types'
import { useShapeBase } from '../useShapeBase'

interface RhombusConfig extends ShapeConfig {
  d1?: MaybeRefOrGetter<number> // length of the first diagonal
  d2?: MaybeRefOrGetter<number> // length of the second diagonal
}

interface Rhombus {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useRhombus(config?: RhombusConfig): Rhombus {
  const { center, rotatePoint } = useShapeBase(config)
  const d1 = config?.d1 ?? 0
  const d2 = config?.d2 ?? 0

  // Vertices
  const vertices = computed(() => {
    const list = []
    list.push(rotatePoint(+(toValue(center).x), +(toValue(center).y) - toValue(d2) / 2))
    list.push(rotatePoint(+(toValue(center).x) - toValue(d1) / 2, +(toValue(center).y)))
    list.push(rotatePoint(+(toValue(center).x), +(toValue(center).y) + toValue(d2) / 2))
    list.push(rotatePoint(+(toValue(center).x) + toValue(d1) / 2, +(toValue(center).y)))
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
   * Get the position of a point on the rhombus's edge
   * @param percentage
   */
  function getPosition(percentage: MaybeRefOrGetter<number> = 0): { x: number; y: number } {
    const side = Math.floor((toValue(percentage) * 4))
    const localPercentage = (toValue(percentage) * 4) - side
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
