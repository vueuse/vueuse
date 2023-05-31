import { nextTick, ref } from 'vue-demi'
import { describe, expect, it, vi } from 'vitest'
import { watchDeep } from '.'

describe('watchDeep', () => {
  it('should work when nested value is updated', async () => {
    const spy = vi.fn((objectUpdate) => {
      expect(objectUpdate).toEqual({ foo: { bar: { deep: 10 } } })
    })

    const obj = ref({ foo: { bar: { deep: 5 } } })
    watchDeep(obj, spy)
    obj.value.foo.bar.deep = 10
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })
})
