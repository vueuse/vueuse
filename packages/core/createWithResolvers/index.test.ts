import { describe, expect, it } from 'vitest'
import { createWithResolvers } from '.'

describe('createWithResolvers', () => {
  it('should create a promise with resolve and reject functions', () => {
    const { promise, resolve, reject } = createWithResolvers<string>()

    expect(promise).toBeInstanceOf(Promise)
    expect(typeof resolve).toBe('function')
    expect(typeof reject).toBe('function')
  })

  it('should resolve the promise', async () => {
    const { promise, resolve } = createWithResolvers<string>()
    const value = 'resolved value'

    resolve(value)

    await expect(promise).resolves.toBe(value)
  })

  it('should reject the promise', async () => {
    const { promise, reject } = createWithResolvers<string>()
    const error = 'rejected error'

    reject(error)

    await expect(promise).rejects.toBe(error)
  })

  it('should be able to destroy the promise and its resolvers', () => {
    let { promise, resolve, reject } = createWithResolvers<string>()

    expect(promise).toBeInstanceOf(Promise)
    expect(typeof resolve).toBe('function')
    expect(typeof reject).toBe('function');

    (resolve as any) = null;
    (reject as any) = null;
    (promise as any) = null

    expect(resolve).toBeNull()
    expect(reject).toBeNull()
    expect(promise).toBeNull()
  })
})
