import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { invoke } from '@vueuse/shared'
import type { Equal, Expect } from '@type-challenges/utils'
import { until } from '.'

describe('until', () => {
  it('should toBe', () => {
    return new Promise<void>((resolve, reject) => {
      const r1 = ref(0)
      const r2 = ref(0)

      invoke(async () => {
        expect(r1.value).toBe(0)
        expect(r2.value).toBe(0)
        let x = await until(r1).toBe(1)
        expect(x).toBe(1)
        x = await until(r2).toBe(ref(2))
        expect(x).toBe(2)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r1.value = 1
        r2.value = 1
      }, 100)

      setTimeout(() => {
        r2.value = 2
      }, 200)
    })
  })

  it('should toBeTruthy', async () => {
    const r = ref(false)
    setTimeout(() => {
      r.value = true
    }, 100)

    expect(await until(r).toBeTruthy()).toBeTruthy()
  })

  it('should toBeUndefined', async () => {
    const r = ref<boolean | undefined>(false)
    setTimeout(() => {
      r.value = undefined
    }, 100)

    expect(await until(r).toBeUndefined()).toBeUndefined()
  })

  it('should toBeNaN', async () => {
    const r = ref(0)
    setTimeout(() => {
      r.value = NaN
    }, 100)

    expect(await until(r).toBeNaN()).toBeNaN()
  })

  it('should toBe timeout with ref', async () => {
    const r = ref(0)
    const reject = vi.fn()
    await invoke(async () => {
      await until(r).toBe(ref(1), { timeout: 200, throwOnTimeout: true })
    }).catch(reject)

    expect(reject).toHaveBeenCalledWith('Timeout')
  })

  it('should work for changedTimes', async () => {
    await new Promise<void>((resolve, reject) => {
      const r = ref(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const x = await until(r).changed()
        expect(x).toBe(1)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
    })
    await new Promise<void>((resolve, reject) => {
      const r = ref(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const x = await until(r).changedTimes(3)
        expect(x).toBe(3)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
        r.value = 2
        r.value = 3
      }, 100)
    })
  })

  it('should support `not`', () => {
    return new Promise<void>((resolve, reject) => {
      const r = ref(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const x = await until(r).not.toBe(0)
        expect(x).toBe(1)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
    })
  })

  it('should support `not` as separate instances', () => {
    return new Promise<void>((resolve, reject) => {
      const r = ref(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const instance = until(r)
        const x = await instance.not.toBe(0)
        const y = await instance.not.toBe(2)
        expect(x).toBe(1)
        expect(y).toBe(1)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
    })
  })

  it('should support toBeNull()', () => {
    return new Promise<void>((resolve, reject) => {
      const r = ref<number | null>(null)

      invoke(async () => {
        expect(r.value).toBe(null)
        const x = await until(r).not.toBeNull()
        expect(x).toBe(1)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
    })
  })

  it('should support array', () => {
    return new Promise<void>((resolve, reject) => {
      const r = ref<number[]>([1, 2, 3])

      invoke(async () => {
        expect(r.value).toEqual([1, 2, 3])
        const x = await until(r).toContains(4, { deep: true })
        expect(x).toEqual([1, 2, 3, 4])
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value.push(4)
      }, 100)
    })
  })

  it('should support array with not', () => {
    return new Promise<void>((resolve, reject) => {
      const r = ref<number[]>([1, 2, 3])

      invoke(async () => {
        expect(r.value).toEqual([1, 2, 3])
        const x = await until(r).not.toContains(2, { deep: true })
        expect(x).toEqual([1])
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value.pop()
        r.value.pop()
      }, 100)
    })
  })

  it('should immediately timeout', () => {
    return new Promise<void>((resolve, reject) => {
      const r = ref(0)

      invoke(async () => {
        expect(r.value).toBe(0)
        const x = await until(r).toBe(1, { timeout: 0 })
        expect(x).toBe(0)
        resolve()
      }).catch(reject)

      setTimeout(() => {
        r.value = 1
      }, 100)
    })
  })

  it('should type check', () => {
    async () => {
      const x = ref<'x'>()
      // type checks are done this way to prevent unused variable warnings
      // and duplicate name warnings
      'test' as any as Expect<Equal<typeof x, Ref<'x' | undefined>>>

      const one = await until(x).toBe(1 as const)
      'test' as any as Expect<Equal<typeof one, 1>>

      const xTruthy = await until(x).toBeTruthy()
      'test' as any as Expect<Equal<typeof xTruthy, 'x'>>

      const xFalsy = await until(x).not.toBeTruthy()
      'test' as any as Expect<Equal<typeof xFalsy, undefined>>

      const xUndef = await until(x).toBeUndefined()
      'test' as any as Expect<Equal<typeof xUndef, undefined>>

      const xNotUndef = await until(x).not.toBeUndefined()
      'test' as any as Expect<Equal<typeof xNotUndef, 'x'>>

      const y = ref<'y' | null>(null)
      'test' as any as Expect<Equal<typeof y, Ref<'y' | null>>>

      const yNull = await until(y).toBeNull()
      'test' as any as Expect<Equal<typeof yNull, null>>

      const yNotNull = await until(y).not.toBeNull()
      'test' as any as Expect<Equal<typeof yNotNull, 'y'>>

      const z = ref<1 | 2 | 3>(1)
      'test' as any as Expect<Equal<typeof z, Ref<1 | 2 | 3>>>

      const is1 = (x: number): x is 1 => x === 1

      const z1 = await until(z).toMatch(is1)
      'test' as any as Expect<Equal<typeof z1, 1>>

      const zNot1 = await until(z).not.toMatch(is1)
      'test' as any as Expect<Equal<typeof zNot1, 2 | 3>>
    }
  })
})
