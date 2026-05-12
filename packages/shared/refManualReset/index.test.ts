import { describe, expect, it } from 'vitest'
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
})
