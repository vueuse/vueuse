import { describe, expect, it } from 'vitest'
import { isReactive } from 'vue'
import { refManualReset } from './index'

describe('refManualReset', () => {
  it('should be defined', () => {
    expect(refManualReset).toBeDefined()
  })

  it('should be default at first', () => {
    const val = refManualReset('default')
    expect(val.value).toBe('default')
  })

  it('should be updated', () => {
    const val = refManualReset('default')

    val.value = 'update'
    expect(val.value).toBe('update')
  })

  it('should be reset', async () => {
    const val = refManualReset('default')
    val.value = 'update'

    val.reset()
    expect(val.value).toBe('default')
  })

  it('object should be reset', async () => {
    const a = refManualReset({ foo: 1 })
    a.value.foo++
    a.reset()
    expect(a.value).toStrictEqual({ foo: 1 })

    const b = refManualReset({ foo: 1 }, true)
    b.value.foo++
    b.reset()
    expect(b.value).toStrictEqual({ foo: 1 })
  })

  it('shallow parameter', async () => {
    const a = refManualReset({ foo: { bar: 1 } })
    const b = refManualReset({ foo: { bar: 1 } }, true)
    expect(isReactive(a.value.foo)).toBe(true)
    expect(isReactive(b.value.foo)).toBe(false)
  })
})
