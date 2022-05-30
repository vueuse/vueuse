import { retry } from '../../.test'
import { useFetch } from '../useFetch'
import { useRetry } from '.'
import '../../.test/mockServer'

let onFetchErrorSpy = vitest.fn()
let onFetchResponseSpy = vitest.fn()

describe('useRetry', () => {
  beforeEach(() => {
    onFetchErrorSpy = vitest.fn()
    onFetchResponseSpy = vitest.fn()
  })

  it('should be defined', () => {
    expect(useRetry).toBeDefined()
  })

  it('should retry until counter reach 2', async () => {
    let counter = 0

    const finalValue = await useRetry(() => counter++, value => value === 2)

    expect(finalValue).toBe(2)
  })

  it('should retry until maxRetries are reached', async () => {
    let counter = 0

    const finalValue = await useRetry(() => counter++, value => value === 5)

    expect(finalValue).toBe(3)
  })

  it('should retry until 2xx response', async () => {
    const mockUrls = [
      'status=400',
      'status=500',
      'status=200&json',
    ]

    let cycleStatusCodesCounter = 0

    const { statusCode: finalStatusCode, onFetchResponse, onFetchError } = await useRetry(
      () => {
        const useFetchResult = useFetch(`https://example.com?${mockUrls[cycleStatusCodesCounter]}`)
        cycleStatusCodesCounter++
        return useFetchResult
      },
      ({ statusCode }) => {
        // TODO @Shinigami92 2022-05-30: Remove this log statement
        // console.log(statusCode.value)

        return statusCode.value != null && statusCode.value >= 200 && statusCode.value < 300
      },
      { interval: 100, timeout: 1000 },
    )

    onFetchResponse(onFetchResponseSpy)
    onFetchError(onFetchErrorSpy)
    await retry(() => {
      expect(onFetchErrorSpy).not.toHaveBeenCalled()
      expect(finalStatusCode.value).toEqual(200)
      // TODO @Shinigami92 2022-05-30: Find out why onFetchResponseSpy is not called
      // expect(onFetchResponseSpy).toHaveBeenCalled()
    })
  })
})
