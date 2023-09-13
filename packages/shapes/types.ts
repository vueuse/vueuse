import type { MaybeRefOrGetter } from '@vueuse/shared'

export interface Vertex {
  x: number
  y: number
}

export interface Edge {
  from: Vertex
  to: Vertex
}

export interface ShapeConfig {
  center?: MaybeRefOrGetter<{ x: number; y: number }>
  rotation?: MaybeRefOrGetter<number>
}
