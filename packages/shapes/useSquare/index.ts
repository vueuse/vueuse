import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { computed, reactive } from 'vue-demi'

interface Vertex {
  x: number
  y: number
}

interface Edge {
  from: Vertex
  to: Vertex
}

interface Square {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
  vertices: Vertex[]
  edges: Edge[]
}

/**
 * Composable for working with squares.
 * @param sideLength - length of the square's side
 * @param center - center of the square {x, y}
 */
export function useSquare(sideLength: MaybeRefOrGetter<number> = 0, center: MaybeRefOrGetter<{
  x: number
  y: number
}> = { x: 0, y: 0 }): Square {
  const halfSize = computed(() => toValue(sideLength) / 2)

  /**
   * A reactive array of the 4 corners of the square.
   * Top left, top right, bottom right, and bottom left.
   */
  const vertices = reactive([
    { x: toValue(center).x - halfSize.value, y: toValue(center).y - halfSize.value }, // top left
    { x: toValue(center).x + halfSize.value, y: toValue(center).y - halfSize.value }, // top right
    { x: toValue(center).x + halfSize.value, y: toValue(center).y + halfSize.value }, // bottom right
    { x: toValue(center).x - halfSize.value, y: toValue(center).y + halfSize.value }, // bottom left
  ])

  /**
   * A reactive array of the 4 edges of the square.
   * Top, right, bottom, and left.
   */
  const edges = reactive([
    { from: vertices[0], to: vertices[1] }, // top edge
    { from: vertices[1], to: vertices[2] }, // right edge
    { from: vertices[2], to: vertices[3] }, // bottom edge
    { from: vertices[3], to: vertices[0] }, // left edge
  ])

  /**
   * Returns the position of a point on the square's perimeter.
   * Pass in a percentage to get the position of a point on the perimeter (0-1).
   * @param percentage
   */
  function getPosition(percentage: MaybeRefOrGetter<number> = 0): { x: number; y: number } {
    const perimeter = toValue(sideLength) * 4
    const pointPosition = toValue(percentage) * perimeter
    let x = 0
    let y = 0

    if (pointPosition <= toValue(sideLength)) {
      // Top edge
      x = vertices[0].x + pointPosition
      y = vertices[0].y
    }
    else if (pointPosition <= toValue(sideLength) * 2) {
      // Right edge
      x = vertices[1].x
      y = vertices[1].y + (pointPosition - toValue(sideLength))
    }
    else if (pointPosition <= toValue(sideLength) * 3) {
      // Bottom edge
      x = vertices[2].x - (pointPosition - toValue(sideLength) * 2)
      y = vertices[2].y
    }
    else {
      // Left edge
      x = vertices[3].x
      y = vertices[3].y - (pointPosition - toValue(sideLength) * 3)
    }

    return { x: +(x).toFixed(10), y: +(y).toFixed(10) }
  }

  return {
    getPosition,
    vertices,
    edges,
  }
}
