import { describe, expect, it } from 'vitest'
import { ref } from 'vue-demi'
import { useAsyncLoading } from '.'

describe('useAsyncLoading', () => {
  it('should be defined', () => {
    expect(useAsyncLoading).toBeDefined()
  })

  it('show loading after `timeout` ms', () => {
    const timeout = 500
    const { asyncLoading, showLoading } = useAsyncLoading({
      timeout,
    })
    expect(asyncLoading.value).toBe(false)
    showLoading()

    setTimeout(() => {
      expect(asyncLoading.value).toBe(false)
    }, timeout - 100)
    setTimeout(() => {
      expect(asyncLoading.value).toBe(true)
    }, timeout + 100)
  })

  it('show loading after at least `delay` ms', () => {
    const timeout = 500
    const delay = 500
    const { asyncLoading, showLoading, hideLoading } = useAsyncLoading({
      timeout,
      delay,
    })

    showLoading()
    setTimeout(() => {
      hideLoading()
    }, timeout + 100)

    setTimeout(() => {
      expect(asyncLoading.value).toBe(true)
    }, timeout + delay)
    setTimeout(() => {
      expect(asyncLoading.value).toBe(false)
    }, timeout + delay + 100)
  })

  it('do not show loading', () => {
    const timeout = 500
    const delay = 500
    const { asyncLoading, showLoading, hideLoading } = useAsyncLoading({
      timeout,
      delay,
    })

    showLoading()
    setTimeout(() => {
      hideLoading()
    }, timeout - 100)

    setTimeout(() => {
      expect(asyncLoading.value).toBe(false)
    }, timeout)
  })

  it('default loading', () => {
    const defaultLoading = ref(false)
    const timeout = 500
    const delay = 500
    const { asyncLoading } = useAsyncLoading({
      timeout,
      delay,
      defaultLoading,
    })

    expect(asyncLoading.value).toBe(false)
    defaultLoading.value = true
    expect(asyncLoading.value).toBe(false)
    setTimeout(() => {
      expect(asyncLoading.value).toBe(true)
    }, timeout)
  })
})
