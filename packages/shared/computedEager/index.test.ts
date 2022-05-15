import { computed, ref, watch } from 'vue-demi'
import { nextTwoTick } from '../../.test'
import { computedEager } from '.'

describe('computedEager', () => {
  it('should be defined', () => {
    expect(computedEager).toBeDefined()
  })

  it('should work', async () => {
    const foo = ref(0)

    const plusOneComputed = computed(() => {
      return foo.value + 1
    })
    const plusOneEagerComputed = computedEager(() => {
      return foo.value + 1
    })

    const plusOneComputedSpy = vitest.fn()
    const plusOneComputedRefSpy = vitest.fn()
    watch(() => plusOneComputed.value, plusOneComputedSpy)
    watch(() => plusOneEagerComputed.value, plusOneComputedRefSpy)

    expect(plusOneComputed.value).toBe(1)
    expect(plusOneEagerComputed.value).toBe(1)
    expect(plusOneComputedSpy).toBeCalledTimes(0)
    expect(plusOneComputedRefSpy).toBeCalledTimes(0)

    foo.value++
    await nextTwoTick()

    expect(plusOneComputed.value).toBe(2)
    expect(plusOneEagerComputed.value).toBe(2)
    expect(plusOneComputedSpy).toBeCalledTimes(1)
    expect(plusOneComputedRefSpy).toBeCalledTimes(1)

    foo.value--
    await nextTwoTick()

    expect(plusOneComputed.value).toBe(1)
    expect(plusOneEagerComputed.value).toBe(1)
    expect(plusOneComputedSpy).toBeCalledTimes(2)
    expect(plusOneComputedRefSpy).toBeCalledTimes(2)
  })

  it('should not trigger collect change if result is not changed', async () => {
    const foo = ref(1)

    const isOddComputed = computed(() => {
      return foo.value % 2 === 0
    })
    const isOddEagerComputed = computedEager(() => {
      return foo.value % 2 === 0
    })

    const isOddComputedSpy = vitest.fn()
    const isOddComputedRefSpy = vitest.fn()
    const isOddComputedCollectSpy = vitest.fn()
    const isOddComputedRefCollectSpy = vitest.fn()

    watch(() => {
      isOddComputedCollectSpy()
      return isOddComputed.value
    }, isOddComputedSpy)
    watch(() => {
      isOddComputedRefCollectSpy()
      return isOddEagerComputed.value
    }, isOddComputedRefSpy)

    expect(isOddComputed.value).toBe(false)
    expect(isOddEagerComputed.value).toBe(false)
    expect(isOddComputedSpy).toBeCalledTimes(0)
    expect(isOddComputedRefSpy).toBeCalledTimes(0)
    expect(isOddComputedCollectSpy).toBeCalledTimes(1)
    expect(isOddComputedRefCollectSpy).toBeCalledTimes(1)

    foo.value++
    await nextTwoTick()

    expect(isOddComputed.value).toBe(true)
    expect(isOddEagerComputed.value).toBe(true)
    expect(isOddComputedSpy).toBeCalledTimes(1)
    expect(isOddComputedRefSpy).toBeCalledTimes(1)
    expect(isOddComputedCollectSpy).toBeCalledTimes(2)
    expect(isOddComputedRefCollectSpy).toBeCalledTimes(2)

    foo.value += 2
    await nextTwoTick()

    expect(isOddComputed.value).toBe(true)
    expect(isOddEagerComputed.value).toBe(true)
    expect(isOddComputedSpy).toBeCalledTimes(1)
    expect(isOddComputedRefSpy).toBeCalledTimes(1)
    expect(isOddComputedCollectSpy).toBeCalledTimes(3)
    expect(isOddComputedRefCollectSpy).toBeCalledTimes(2)
  })
})
