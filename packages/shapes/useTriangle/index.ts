import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import type { Edge, ShapeConfig, Vertex } from '../types'
import { usePolygon } from '../usePolygon'

interface TriangleConfig extends ShapeConfig {
  sideLength?: MaybeRefOrGetter<number>
}

interface Triangle {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useTriangle(config?: TriangleConfig): Triangle {
  // UsePolygon
  const { vertices, edges, getPosition } = usePolygon({ sides: 3, sideLength: config?.sideLength, center: config?.center, rotation: config?.rotation })

  return {
    getPosition,
    vertices,
    edges,
  }
}
