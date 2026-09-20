import type { ShallowRef } from 'vue'
import type { useResizeObserver } from './index'
import { describe, expectTypeOf, it } from 'vitest'

describe('useResizeObserver', () => {
  it('accepts an array template ref bound to v-for as target', () => {
    expectTypeOf<Readonly<ShallowRef<HTMLElement[] | null>>>()
      .toExtend<Parameters<typeof useResizeObserver>[0]>()
  })
})
