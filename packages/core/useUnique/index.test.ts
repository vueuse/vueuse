import { unref } from 'vue'
import { useUnique } from '.'

const arr = [2, 2, 3, 4, 5, 6, 7, 7, 8, 10, 10]

describe('useUnique', () => {
  it('should be defined', () => {
    expect(useUnique).toBeDefined()
  })

  it('should return unique array', () => {
    const uniq = useUnique(arr)

    expect(unref(uniq)).toMatchObject([2, 3, 4, 5, 6, 7, 8, 10])
  })
})
