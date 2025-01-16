import Cookie from 'universal-cookie'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick, watch } from 'vue'
import { useCookies } from '.'

describe('useCookies', () => {
  afterEach(() => {
    const cookies = new Cookie()
    cookies.remove('testCookie')
  })

  it('should get a cookie value that is already set', () => {
    // Arrange
    const cookies = new Cookie()
    const { get } = useCookies(['testCookie'])

    // Act
    cookies.set('testCookie', 'testValue')

    // Assert
    const value = get('testCookie')
    expect(value).toBe('testValue')
  })

  it('should set and remove a cookie', () => {
    // Arrange
    const { set, remove, get } = useCookies([])

    // Act
    set('testCookie', 'newValue')
    expect(get('testCookie')).toBe('newValue')
    remove('testCookie')

    // Assert
    expect(get('testCookie')).toBeUndefined()
  })

  it('should trigger rerender when cookies change', async () => {
    // Arrange
    const { get, set } = useCookies(['testCookie'])
    let value
    watch(
      () => get('testCookie'),
      (newValue) => {
        value = newValue
      },
    )

    // 1. Set initial value
    set('testCookie', 'testValue')
    await nextTick()
    expect(value).toBe('testValue')

    // 2. Change to a new value
    set('testCookie', 'newValue')
    await nextTick()
    expect(value).toBe('newValue')
  })

  it('should not trigger rerender when we pass empty dependencies array', async () => {
    // Arrange
    const { get, set } = useCookies([])
    let value
    watch(
      () => get('testCookie'),
      (newValue) => {
        value = newValue
      },
    )

    // Act
    set('testCookie', 'testValue')
    await nextTick()

    // Assert
    expect(value).toBe(undefined)
  })
})
