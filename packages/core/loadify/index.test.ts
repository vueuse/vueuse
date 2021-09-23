import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { loadify } from '.'

describe('loadify', () => {
  it('should be defined', () => {
    expect(loadify).toBeDefined()
  })

  it('should return a function that returns the same value', () => {
    useSetup(async() => {
      const isLoading = ref(false)
      const value = 42
      const fn = async(value: any) => value
      const res = await fn(value)
      const resWrapped = await loadify(isLoading, fn)(value)
      expect(res).toBe(resWrapped)
    })
  })

  it('should return a promise that resolves to the same value', () => {
    useSetup(async() => {
      const isLoading = ref(false)
      const value = 42
      const fn = async(value: any) => value
      const promise = fn(value)
      const res = await promise
      const resWrapped = await loadify(isLoading, promise)
      expect(res).toBe(resWrapped)
    })
  })

  it('should set `isLoading` to `true` when the promise is not resolved yet', () => {
    useSetup(() => {
      const isLoading = ref(false)
      const value = 42
      const delay = (ms: number, value: any) => new Promise(resolve => setTimeout(() => resolve(value), ms))
      const delayLoadified = loadify(isLoading, delay)
      delayLoadified(value, 1)
      expect(isLoading.value).toBe(true)
    })
  })

  it('should set `isLoading` to `false` when the promise is resolved', () => {
    useSetup(async() => {
      const isLoading = ref(false)
      const value = 42
      const delay = (ms: number, value: any) => new Promise(resolve => setTimeout(() => resolve(value), ms))
      const delayLoadified = loadify(isLoading, delay)
      await delayLoadified(value, 1)
      expect(isLoading.value).toBe(false)
    })
  })
})
