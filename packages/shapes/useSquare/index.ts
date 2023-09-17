import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import type { Edge, ShapeConfig, Vertex } from '../types'
import { usePolygon } from '../usePolygon'

interface SquareConfig extends ShapeConfig {
  sideLength?: MaybeRefOrGetter<number>
}

interface Square {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: ComputedRef<Vertex[]>
  edges: ComputedRef<Edge[]>
}

export function useSquare(config?: SquareConfig): Square {
  // UsePolygon
  const { vertices, edges, getPosition } = usePolygon({ sides: 4, sideLength: config?.sideLength, center: config?.center, rotation: config?.rotation })

  return {
    getPosition,
    vertices,
    edges,
  }
}
