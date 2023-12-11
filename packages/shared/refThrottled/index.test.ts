import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { refThrottled } from './index'

describe('refThrottled', () => {
  it('should return the original value if delay is less than or equal to 0', () => {
    const value = ref(10)
    const result = refThrottled({
      value,
      delay: 0,
    })
    expect(result).toBe(value)
  })

  it('should return a throttled ref value with default parameters', () => {
    const value = ref(10)
    const result = refThrottled({
      value,
    })
    expect(result.value).toBe(10)
  })

  it('should update the throttled value after the specified delay', () => {
    const value = ref(10)
    const result = refThrottled({
      value,
      delay: 200,
    })
    value.value = 20
    setTimeout(() => {
      expect(result.value).toBe(20)
    }, 300)
  })

  it('should update the throttled value on the leading edge of the delay', () => {
    const value = ref(10)
    const result = refThrottled({
      value,
      delay: 200,
      leading: true,
      trailing: true,
    })
    value.value = 20
    setTimeout(() => {
      expect(result.value).toBe(20)
    }, 100)
  })

  it('should update the throttled value on the trailing edge of the delay', () => {
    const value = ref(10)
    const result = refThrottled({
      value,
      delay: 200,
      trailing: true,
      leading: false,
    })
    value.value = 20
    setTimeout(() => {
      expect(result.value).toBe(20)
    }, 300)
  })

  it('should update the deep-cloned throttled value when the original value is an object', () => {
    const value = ref({ name: 'John' })
    const result = refThrottled({
      value,
      delay: 200,
    })
    value.value.name = 'Doe'
    setTimeout(() => {
      expect(result.value.name).toBe('John')
    }, 300)
  })

  it('should update the deep-cloned throttled value when the original value is an array', () => {
    const value = ref([1, 2, 3])
    const result = refThrottled({
      value,
      delay: 200,
    })
    value.value.push(4)
    setTimeout(() => {
      expect(result.value).toEqual([1, 2, 3])
    }, 300)
  })

  it('should update the throttled value without leading edge update', () => {
    const value = ref(10)
    const result = refThrottled({
      value,
      delay: 200,
      leading: false,
      trailing: true,
    })
    value.value = 20
    setTimeout(() => {
      expect(result.value).toBe(10)
    }, 100)
  })

  it('should update the throttled value without trailing edge update', () => {
    const value = ref(10)
    const result = refThrottled({
      value,
      delay: 200,
      trailing: false,
      leading: true,
    })
    value.value = 20
    setTimeout(() => {
      expect(result.value).toBe(10)
    }, 300)
  })
})
