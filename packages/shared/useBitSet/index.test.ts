import { useBitSet } from '.'

describe('useBitSet', () => {
  it('default', () => {
    const localBitSet = useBitSet()
    localBitSet.add(8)
    localBitSet.add(15)
    expect(localBitSet.has(8)).toEqual(true)
    expect(localBitSet.has(22)).toEqual(false)
    expect(localBitSet.has(15)).toEqual(true)
    localBitSet.reset()
    expect(localBitSet.isEmpty()).toEqual(true)
  })
})
