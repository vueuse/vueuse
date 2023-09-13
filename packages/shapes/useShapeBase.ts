import { toValue } from '@vueuse/shared'
import { computed } from 'vue-demi'
import type { ShapeConfig } from './types'

export function useShapeBase(config?: ShapeConfig) {
  const center = config?.center ?? {
    x: 0,
    y: 0,
  }
  const rotation = config?.rotation ?? 0

  const rotatePoint = (x: number, y: number) => {
    const dx = x - +(toValue(center).x)
    const dy = y - +(toValue(center).y)
    return {
      x: +(toValue(center).x) + dx * Math.cos(toValue(rotation) * (Math.PI / 180)) - dy * Math.sin(toValue(rotation) * (Math.PI / 180)),
      y: +(toValue(center).y) + dx * Math.sin(toValue(rotation) * (Math.PI / 180)) + dy * Math.cos(toValue(rotation) * (Math.PI / 180)),
    }
  }

  return {
    center: computed(() => toValue(center)),
    rotation: computed(() => toValue(rotation)),
    rotatePoint,
  }
}
