import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { unrefy } from '.'

describe('unrefy', () => {
  it('should be defined', () => {
    expect(unrefy).toBeDefined()
  })

  it('should return a function that returns the same value', () => {
    useSetup(() => {
      const value = 42
      const fn = (value: any) => value
      const res = fn(value)
      const resWrapped = unrefy(fn)(value)
      expect(res).toBe(resWrapped)
    })
  })
})
