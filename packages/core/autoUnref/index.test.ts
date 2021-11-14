import { useSetup } from '../../.test'
import { createUnrefFn } from '.'

describe('createUnrefFn', () => {
  it('should be defined', () => {
    expect(createUnrefFn).toBeDefined()
  })

  it('should return a function that returns the same value', () => {
    useSetup(() => {
      const value = 42
      const fn = (value: any) => value
      const res = fn(value)
      const resWrapped = createUnrefFn(fn)(value)
      expect(res).toBe(resWrapped)
    })
  })
})
