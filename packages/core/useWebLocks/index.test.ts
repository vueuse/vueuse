import { describe, expect, it } from 'vitest'
import { isExpectedWebLockRejection, useWebLocks, useWebLocksAbortLockHeld, useWebLocksAbortLockStolen, useWebLocksAbortScopeDisposed } from '.'

describe('useWebLocks', () => {
  it('should be defined', () => {
    expect(useWebLocks).toBeDefined()
  })
  it('should not be supported', () => {
    expect(useWebLocks().isSupported.value).toBe(false)
  })
  it('should reject requests', async () => {
    await expect(() => useWebLocks().request('lock', () => {})).rejects.toThrowError('Web Locks API or AbortController not supported')
  })
})

describe('isExpectedWebLockRejection', () => {
  it('should be defined', () => {
    expect(isExpectedWebLockRejection).toBeDefined()
  })
  it('should work', () => {
    expect(isExpectedWebLockRejection(useWebLocksAbortScopeDisposed)).toBe(true)
    expect(isExpectedWebLockRejection(useWebLocksAbortLockHeld)).toBe(true)
    expect(isExpectedWebLockRejection(useWebLocksAbortLockStolen)).toBe(true)
    expect(isExpectedWebLockRejection(undefined)).toBe(false)
    expect(isExpectedWebLockRejection(new Error('test'))).toBe(false)
  })
})
