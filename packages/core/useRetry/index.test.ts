import { retry } from '../../.test'
import { useFetch } from '../useFetch'
import { useRetry } from '.'
import '../../.test/mockServer'

let onFinishSpy = vitest.fn()

describe('useRetry', () => {
  beforeEach(() => {
    onFinishSpy = vitest.fn()
  })

  it('should be defined', () => {
    expect(useRetry).toBeDefined()
  })

  it('should retry until counter reach 2', async () => {
    let counter = 0

    const { onFinish, isFinished } = await useRetry(
      () => counter++,
      value => value === 2,
      { interval: 10 },
    )

    expect(isFinished.value).toBeTruthy()

    onFinish(onFinishSpy)
    await retry(() => {
      expect(onFinishSpy).toHaveBeenCalled()
    })
  })

  it('should retry until maxRetries are reached', async () => {
    let counter = 0

    const { onFinish, isFinished } = await useRetry(
      () => counter++,
      value => value === 5,
      { interval: 10 },
    )

    expect(isFinished.value).toBeTruthy()

    expect(counter).toBe(4)

    onFinish(onFinishSpy)
    await retry(() => {
      expect(onFinishSpy).toHaveBeenCalled()
    })
  })

  it('should retry until 2xx response', async () => {
    const mockUrls = [
      'status=400',
      'status=500',
      'status=200&json',
    ]

    let cycleStatusCodesCounter = 0

    const { onFinish, isFinished } = useRetry(
      () => {
        const useFetchResult = useFetch(`https://example.com?${mockUrls[cycleStatusCodesCounter]}`)
        cycleStatusCodesCounter++
        return useFetchResult
      },
      ({ statusCode }) => {
        // TODO @Shinigami92 2022-05-30: Remove this log statement
        // console.log(statusCode.value)

        return statusCode.value === 200
      },
      { interval: 10 },
    )

    onFinish(onFinishSpy)
    await retry(() => {
      expect(isFinished.value).toBeTruthy()
      expect(onFinishSpy).toHaveBeenCalled()
    })
  })
})
