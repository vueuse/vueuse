import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'

interface Circle {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
}

/**
 * Composable for working with circles.
 *
 * @see https://vueuse.org/useCircle
 * @param radius - radius of the circle
 * @param center - center of the circle {x, y}
 */
export function useCircle(radius: MaybeRefOrGetter<number> = 0, center: MaybeRefOrGetter<{
  x: number
  y: number
}> = { x: 0, y: 0 }): Circle {
  /**
   * Returns the position of a point on the circle's perimeter.
   * Pass in a percentage to get the position of a point on the perimeter (0-1).
   * @param percentage
   */
  function getPosition(percentage: MaybeRefOrGetter<number> = 0): { x: number; y: number } {
    return {
      x: +(toValue(center).x + (Math.cos((360 * toValue(percentage)) * (Math.PI / 180)) * toValue(radius))).toFixed(10),
      y: +(toValue(center).y + (Math.sin((360 * toValue(percentage)) * (Math.PI / 180)) * toValue(radius))).toFixed(10),
    }
  }

  return {
    getPosition,
  }
}
