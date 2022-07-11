import type { MaybeRef } from '@vueuse/shared'
import { assert } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, unref } from 'vue-demi'

export function useNumberRange(
  min: MaybeRef<number>,
  max: MaybeRef<number>,
  start: MaybeRef<number>,
  end: MaybeRef<number>,
): Ref<[number, number]> {
  return computed(() => {
    const minValue = unref(min)
    const maxValue = unref(max)
    const startValue = unref(start)
    const endValue = unref(end)

    assert(endValue - startValue <= maxValue - minValue, `'end'(${endValue}) minus 'start'(${startValue}) must be less than 'max'(${maxValue}) minus 'min'(${minValue})`)

    if (startValue < minValue) {
      const offset = minValue - startValue
      const actualStartValue = minValue
      const actualEnd = endValue + offset
      assert(actualEnd <= maxValue, `'end'(${actualEnd}) must lesser than or equals to 'max'(${maxValue})`)

      return [actualStartValue, actualEnd]
    }
    if (endValue > maxValue) {
      const offset = endValue - maxValue
      const actualStart = startValue - offset
      const actualEnd = maxValue
      assert(actualStart >= minValue, `'start'(${actualStart}) must greater than or equals to 'min'(${minValue})`)
      return [actualStart, actualEnd]
    }

    return [startValue, endValue]
  })
}
