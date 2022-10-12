import { nextTick, reactive, ref } from 'vue-demi'
import { watchArray } from '.'

describe('watchArray', () => {
  it('should work when two lists are different', async () => {
    const spy = vitest.fn((newList, oldList, added, removed) => {
      expect(newList).toEqual([1, 1, 4])
      expect(oldList).toEqual([1, 2, 3])
      expect(added).toEqual([1, 4])
      expect(removed).toEqual([2, 3])
    })

    const num = ref([1, 2, 3])
    watchArray(num, spy)
    num.value = [1, 1, 4]
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('should work when two lists are identical', async () => {
    const spy = vitest.fn((newList, oldList, added, removed) => {
      expect(newList).toEqual([1, 2, 3])
      expect(oldList).toEqual([1, 2, 3])
      expect(added).toEqual([])
      expect(removed).toEqual([])
    })

    const num = ref([1, 2, 3])
    watchArray(num, spy)
    num.value = [1, 2, 3]
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('should work with list push', async () => {
    const spy = vitest.fn((newList, oldList, added, removed) => {
      expect(newList).toEqual([1, 2, 3, 4])
      expect(oldList).toEqual([1, 2, 3])
      expect(added).toEqual([4])
      expect(removed).toEqual([])
    })

    const num = ref([1, 2, 3])
    watchArray(num, spy, { deep: true })
    num.value.push(4)
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('should work with list splice', async () => {
    const spy = vitest.fn((newList, oldList, added, removed) => {
      expect(newList).toEqual([1, 5, 6, 7, 3])
      expect(oldList).toEqual([1, 2, 3])
      expect(added).toEqual([5, 6, 7])
      expect(removed).toEqual([2])
    })

    const num = ref([1, 2, 3])
    watchArray(num, spy, { deep: true })
    num.value.splice(1, 1, 5, 6, 7)
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('should work with reactive source', async () => {
    const spy = vitest.fn((newList, oldList, added, removed) => {
      expect(newList).toEqual([1, 2, 3, 4])
      expect(oldList).toEqual([1, 2, 3])
      expect(added).toEqual([4])
      expect(removed).toEqual([])
    })

    const num = reactive([1, 2, 3])
    watchArray(num, spy)
    num.push(4)
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('should work with functional source', async () => {
    const spy = vitest.fn((newList, oldList, added, removed) => {
      expect(newList).toEqual([1, 2, 3, 4])
      expect(oldList).toEqual([1, 2, 3])
      expect(added).toEqual([4])
      expect(removed).toEqual([])
    })

    const num = ref([1, 2, 3])
    watchArray(() => num.value, spy)
    num.value = [...num.value, 4]
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })

  it('should work when immediate is true', async () => {
    const spy = vitest.fn()

    const num = ref([1, 2, 3])
    watchArray(() => num.value, spy, { immediate: true })
    expect(spy).toHaveBeenCalledWith([1, 2, 3], [], [1, 2, 3], [], expect.anything())
    num.value = [1, 2, 3, 4]
    await nextTick()
    expect(spy).toHaveBeenCalledWith([1, 2, 3, 4], [1, 2, 3], [4], [], expect.anything())
  })
})
