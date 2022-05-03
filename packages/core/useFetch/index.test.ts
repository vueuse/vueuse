import { ref } from 'vue-demi'
import { until } from '@vueuse/shared'
import { retry } from '../../.test'
import '../../.test/mockServer'
import { createFetch, useFetch } from '.'

const jsonMessage = { hello: 'world' }
const jsonUrl = `https://example.com?json=${encodeURI(JSON.stringify(jsonMessage))}`

// Listen to make sure fetch is actually called.
// Use msw to stub out the req/res
let fetchSpy = vitest.spyOn(window, 'fetch')
let onFetchErrorSpy = vitest.fn()
let onFetchResponseSpy = vitest.fn()
let onFetchFinallySpy = vitest.fn()

const fetchSpyHeaders = (idx = 0) => fetchSpy.mock.calls[idx][1]!.headers

describe('useFetch', () => {
  beforeEach(() => {
    fetchSpy = vitest.spyOn(window, 'fetch')
    onFetchErrorSpy = vitest.fn()
    onFetchResponseSpy = vitest.fn()
    onFetchFinallySpy = vitest.fn()
  })

  test('should have status code of 200 and message of Hello World', async () => {
    const { statusCode, data } = useFetch('https://example.com?text=hello')

    await retry(() => {
      expect(fetchSpy).toHaveBeenCalledOnce()
      expect(data.value).toBe('hello')
      expect(statusCode.value).toBe(200)
    })
  })

  test('should be able to use the Headers object', async () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'test')

    useFetch('https://example.com/', { headers: myHeaders })

    await retry(() => {
      expect(fetchSpyHeaders()).toEqual({ authorization: 'test' })
    })
  })

  test('should parse response as json', async () => {
    const { data } = useFetch(jsonUrl).json()
    await retry(() => {
      expect(data.value).toEqual(jsonMessage)
    })
  })

  test('should have an error on 400', async () => {
    const { error, statusCode } = useFetch('https://example.com?status=400')

    await retry(() => {
      expect(statusCode.value).toBe(400)
      expect(error.value).toBe('Bad Request')
    })
  })

  test('should abort request and set aborted to true', async () => {
    const { aborted, abort, execute } = useFetch('https://example.com')
    setTimeout(() => abort(), 0)
    await retry(() => expect(aborted.value).toBe(true))
    execute()
    setTimeout(() => abort(), 0)
    await retry(() => expect(aborted.value).toBe(true))
  })

  test('should not call if immediate is false', async () => {
    useFetch('https://example.com', { immediate: false })
    await retry(() => expect(fetchSpy).toBeCalledTimes(0))
  })

  test('should refetch if refetch is set to true', async () => {
    const url = ref('https://example.com')
    useFetch(url, { refetch: true })
    url.value = 'https://example.com?text'
    await retry(() => expect(fetchSpy).toBeCalledTimes(2))
  })

  test('should auto refetch when the refetch is set to true and the payload is a ref', async () => {
    const param = ref({ num: 1 })
    useFetch('https://example.com', { refetch: true }).post(param)
    param.value.num = 2
    await retry(() => expect(fetchSpy).toBeCalledTimes(2))
  })

  test('should create an instance of useFetch with a base url', async () => {
    const fetchHeaders = { Authorization: 'test' }
    const requestHeaders = { 'Accept-Language': 'en-US' }
    const allHeaders = { ...fetchHeaders, ...requestHeaders }
    const useMyFetch = createFetch({ baseUrl: 'https://example.com', fetchOptions: { headers: fetchHeaders } })
    useMyFetch('test', { headers: requestHeaders })

    await retry(() => {
      expect(fetchSpy).toHaveBeenCalledOnce()
      expect(fetchSpy).toHaveBeenCalledWith('https://example.com/test', expect.anything())
      expect(fetchSpyHeaders()).toMatchObject(allHeaders)
    })
  })

  test('should run the beforeFetch function and add headers to the request', async () => {
    useFetch('https://example.com', { headers: { 'Accept-Language': 'en-US' } }, {
      beforeFetch({ options }) {
        options.headers = {
          ...options.headers,
          Authorization: 'my-auth-token',
        }

        return { options }
      },
    })

    await retry(() => {
      expect(fetchSpyHeaders()).toMatchObject({ 'Authorization': 'my-auth-token', 'Accept-Language': 'en-US' })
    })
  })

  test('should run the beforeFetch has default headers', async () => {
    useFetch('https://example.com', {
      beforeFetch({ options }) {
        expect(options.headers).toBeDefined()
        return { options }
      },
    })
  })

  test('should run the beforeFetch function and cancel the request', async () => {
    const { execute } = useFetch('https://example.com', {
      immediate: false,
      beforeFetch({ cancel }) {
        cancel()
      },
    })

    await execute()
    expect(fetchSpy).toBeCalledTimes(0)
  })

  test('should run the afterFetch function', async () => {
    const { data } = useFetch(jsonUrl, {
      afterFetch(ctx) {
        ctx.data.title = 'Hunter x Hunter'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(data.value).toEqual(expect.objectContaining({ title: 'Hunter x Hunter' }))
    })
  })

  test('should run the onFetchError function', async () => {
    const { data, statusCode } = useFetch('https://example.com?status=400&json', {
      onFetchError(ctx) {
        ctx.data.title = 'Hunter x Hunter'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(statusCode.value).toEqual(400)
      expect(data.value).toEqual(expect.objectContaining({ title: 'Hunter x Hunter' }))
    })
  })

  test('should run the onFetchError function when network error', async () => {
    const { data, statusCode } = useFetch('https://example.com?status=500&text=Internal%20Server%20Error', {
      onFetchError(ctx) {
        ctx.data = { title: 'Hunter x Hunter' }

        return ctx
      },
    }).json()

    await retry(() => {
      expect(statusCode.value).toStrictEqual(500)
      expect(data.value).toEqual({ title: 'Hunter x Hunter' })
    })
  })

  test('should emit onFetchResponse event', async () => {
    const onResponseSpy = vitest.fn()
    const { onFetchResponse } = useFetch('https://example.com')

    onFetchResponse(onResponseSpy)
    await retry(() => {
      expect(onResponseSpy).toHaveBeenCalledOnce()
    })
  })

  test('should emit onFetchResponse event', async () => {
    const { onFetchResponse, onFetchError, onFetchFinally } = useFetch('https://example.com')

    onFetchResponse(onFetchResponseSpy)
    onFetchError(onFetchErrorSpy)
    onFetchFinally(onFetchFinallySpy)
    await retry(() => {
      expect(onFetchErrorSpy).not.toHaveBeenCalled()
      expect(onFetchResponseSpy).toHaveBeenCalled()
      expect(onFetchFinallySpy).toHaveBeenCalled()
    })
  })

  test('should emit onFetchError event', async () => {
    const { onFetchError, onFetchFinally, onFetchResponse } = useFetch('https://example.com?status=400')

    onFetchError(onFetchErrorSpy)
    onFetchResponse(onFetchResponseSpy)
    onFetchFinally(onFetchFinallySpy)

    await retry(() => {
      expect(onFetchErrorSpy).toHaveBeenCalled()
      expect(onFetchResponseSpy).not.toHaveBeenCalled()
      expect(onFetchFinallySpy).toHaveBeenCalled()
    })
  })

  test('setting the request method w/ get and return type w/ json', async () => {
    const { data } = useFetch(jsonUrl).get().json()
    await retry(() => expect(data.value).toEqual(jsonMessage))
  })

  test('setting the request method w/ post and return type w/ text', async () => {
    const { data } = useFetch(jsonUrl).post().text()
    await retry(() => expect(data.value).toEqual(JSON.stringify(jsonMessage)))
  })

  test('allow setting response type before doing request', async () => {
    const shell = useFetch(jsonUrl, {
      immediate: false,
    }).get().text()
    shell.json()
    shell.execute()
    await retry(() => expect(shell.data.value).toEqual(jsonMessage))
  })

  test('not allowed setting response type while doing request', async () => {
    const shell = useFetch(jsonUrl).get().text()
    const { isFetching, data } = shell
    await until(isFetching).toBe(true)
    shell.json()
    await retry(() => expect(data.value).toEqual(JSON.stringify(jsonMessage)))
  })

  test('should abort request when timeout reached', async () => {
    const { aborted, execute } = useFetch('https://example.com?delay=100', { timeout: 10 })

    await retry(() => expect(aborted.value).toBeTruthy())
    await execute()
    await retry(() => expect(aborted.value).toBeTruthy())
  })

  test('should not abort request when timeout is not reached', async () => {
    const { data } = useFetch(jsonUrl, { timeout: 100 }).json()
    await retry(() => expect(data.value).toEqual(jsonMessage))
  })

  test('should await request', async () => {
    const { data } = await useFetch(jsonUrl).json()
    expect(data.value).toEqual(jsonMessage)
    expect(fetchSpy).toBeCalledTimes(1)
  })

  test('should await json response', async () => {
    const { data } = await useFetch(jsonUrl).json()

    expect(data.value).toEqual(jsonMessage)
    expect(fetchSpy).toBeCalledTimes(1)
  })
})
