import { renderHook } from '../../_docs/tests'
import { useWebWorkerFunction } from '../useWebWorkerFunction'

const numbers: number[] = Array(5000000).fill(1).map(ele => ~~(Math.random() * 1000000))
const sortNumbers = (nums: number[]): number[] => nums.sort()

describe('useCounter', () => {
  it('should be defined', () => {
    expect(useWebWorkerFunction).toBeDefined()
  })

  it('Exported Functions Works Fine', (done) => {
    renderHook(async() => {
      const { workerHook } = useWebWorkerFunction(sortNumbers)
      const data = await workerHook(numbers)
      const isSorted = data.every((ele, i) => data[i + 1] && ele <= data[i + 1])

      expect(data.length).toEqual(sortNumbers.length)
      expect(isSorted).toEqual(true)
      done()
    })
  })
})
