import { describe, expect, it } from 'vitest'
import { ref } from 'vue-demi'
import { refThrottled } from '.'

describe('refThrottled', () => {
  it('should handle string type', async () => {
    const strRef = ref('Hello')
    const throttledRef = refThrottled(strRef, 100)

    expect(throttledRef.value).toBe('Hello')

    strRef.value = 'World'
    expect(throttledRef.value).toBe('Hello')
    await new Promise(resolve => setTimeout(resolve, 200))

    expect(throttledRef.value).toBe('World')
  })

  it('should handle object type', async () => {
    const objRef = ref({ key: 'value' })
    const throttledRef = refThrottled(objRef, 100)

    expect(throttledRef.value).toEqual({ key: 'value' })

    objRef.value.key = 'new value'
    expect(throttledRef.value).toEqual({ key: 'value' })
    await new Promise(resolve => setTimeout(resolve, 200))

    expect(throttledRef.value).toEqual({ key: 'new value' })
  })

  it('should handle array type', async () => {
    const arrRef = ref([1, 2, 3])
    const throttledRef = refThrottled(arrRef, 100)
    expect(throttledRef.value).toEqual([1, 2, 3])
    arrRef.value.push(4)
    expect(throttledRef.value).toEqual([1, 2, 3])
    await new Promise(resolve => setTimeout(resolve, 200))

    expect(throttledRef.value).toEqual([1, 2, 3, 4])
  })

  it('should handle cloneHandler', async () => {
    const objRef = ref({ key: 'value' })
    let error = null

    try {
      refThrottled(objRef, 100, true, true, true, true, () => {
        throw new Error('cloneHandler error')
      })
    }
    catch (e) {
      error = e as Error
    }

    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('cloneHandler error')
  })

  it('should handle default cloneHandler error', async () => {
    const objRef = ref({}) as any
    objRef.value.self = objRef.value
    let error = null
    let throttledRef = null
    try {
      throttledRef = refThrottled(objRef, 100, true, true, true)
    }
    catch (e) {
      error = e as Error
    }
    expect(throttledRef?.value).toEqual(objRef.value)
    expect(error).toBeNull()
  })
})
