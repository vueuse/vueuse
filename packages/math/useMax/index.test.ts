import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { useMax } from '.'

describe('useFloor', () => {
  it('should be defined', () => {
    expect(useMax).toBeDefined()
  })
  it('should work', () => {
    const value = 10
    const maximum = 100
    const v = useMax(value, maximum)
    expect(v.value).toBe(10)

    const refValue = ref<number | MaybeRef<number>[]>(20)
    const v2 = useMax(refValue as Ref<number>, maximum)

    expect(v2.value).toBe(20)

    refValue.value = 200
    expect(v2.value).toBe(100)

    refValue.value = [1, 10, 30, 90, 140, 200]
    expect(v2.value).toBe(100)

    const n1 = ref(10)
    const n2 = ref(20)

    refValue.value = [1, n1, n2]
    expect(v2.value).toBe(20)

    refValue.value = [1, n1, n2, 90]
    expect(v2.value).toBe(90)

    refValue.value = [1, n1, n2, 120]
    expect(v2.value).toBe(100)

    const n3 = ref(140)
    refValue.value = [1, n1, n2, n3]
    expect(v2.value).toBe(100)

    n1.value = 12
    n2.value = 20
    n3.value = 60
    expect(v2.value).toBe(60)

    n1.value = 120
    n2.value = 200
    n3.value = 600
    expect(v2.value).toBe(100)

    const v3 = useMax(refValue)
    expect(v3.value).toBe(600)

    n1.value = 120
    n2.value = 200
    n3.value = 60
    expect(v3.value).toBe(200)

    const nums = [n1, n2, 10]
    const v4 = useMax(nums, 100)
    expect(v4.value).toBe(100)

    n1.value = 20
    n2.value = 60
    expect(v4.value).toBe(60)
  })
})
