import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'

interface CircleConfig {
  radius?: MaybeRefOrGetter<number>
  center?: MaybeRefOrGetter<{ x: number; y: number }>
}

interface Circle {
  getPosition: (percentage: MaybeRefOrGetter<number>) => { x: number; y: number }
}

/**
 * Composable for working with circles.
 *
 * @see https://vueuse.org/useCircle
 * @param config - Configuration object for the circle
 */
export function useCircle(config?: CircleConfig): Circle {
  const radius = config?.radius ?? 0
  const center = config?.center ?? { x: 0, y: 0 }

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
