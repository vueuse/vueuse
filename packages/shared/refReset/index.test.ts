import { describe, expect, it } from 'vitest'
import { refReset, resetRef } from '.'

describe('refReset', () => {
  it('should be defined', () => {
    expect(refReset).toBeDefined()
    expect(resetRef).toBeDefined()
  })

  it('should be default at first', () => {
    const val = refReset('default')
    expect(val.value).toBe('default')
  })

  it('should be updated', () => {
    const val = refReset('default')

    val.value = 'update'
    expect(val.value).toBe('update')
  })

  it('should be reset', async () => {
    const val = refReset('default')
    val.value = 'update'

    val.reset()
    expect(val.value).toBe('default')
  })

  it('should be reset with maybeRef', async () => {
    const val = refReset(() => [123])
    val.value = [999]
    expect(val.value).toEqual([999])
    val.reset()
    expect(val.value).toEqual([123])
  })

  it('should be reset if nullish value is set', async () => {
    const val = refReset(() => [123], true)
    val.value = [999]
    expect(val.value).toEqual([999])
    val.value = undefined!
    expect(val.value).toEqual([123])
  })

  it('should not mutate the default value from getter', async () => {
    const val = refReset(() => ({ name: 'default' }))
    val.value.name = 'Hulk'
    expect(val.value).toEqual({ name: 'Hulk' })
    val.reset()
    expect(val.value).toEqual({ name: 'default' })
  })
})
