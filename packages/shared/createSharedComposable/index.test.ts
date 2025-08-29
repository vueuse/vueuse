import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { createSharedComposable } from '.'

describe('createSharedComposable', () => {
  it('should return the sharedComposable', () => {
    const useShared = createSharedComposable(() => shallowRef('data'))
    const data1 = useShared()
    const data2 = useShared()

    expect(data1).toBe(data2)
  })
})
