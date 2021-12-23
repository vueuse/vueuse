import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { ref } from 'vue-demi'
import { until } from '@vueuse/shared'
import { retry } from '../../.test/test.setup'
import { createFetch, useFetch } from '.'

const jsonMessage = { hello: 'world' }
const textMessage = 'Hello World'
const commonTransformers = (req, _, ctx) => {
  const t = []
  const qs = req.url.searchParams
  if (qs.get('delay')) t.push(ctx.delay(Number(qs.get('delay'))))
  if (qs.get('status')) t.push(ctx.status(Number(qs.get('status'))))
  if (qs.get('text') != null) {
    t.push(ctx.text(qs.get('text') ?? textMessage))
  }
  else if (qs.get('json') != null) {
    const jsonVal = qs.get('json')
    const jsonTransformer = ctx.json(jsonVal?.length ? JSON.parse(jsonVal) : jsonMessage)
    t.push(jsonTransformer)
  }
  return t
}

const server = setupServer(
  rest.post('https://example.com', (req, res, ctx) => {
    const t = commonTransformers(req, res, ctx)
    if (typeof req.body === 'number' || typeof req.body === 'string') t.push(ctx.text(String(req.body)))
    else t.push(ctx.json(req.body))
    return res(...t)
  }),
  rest.get('https://example.com', (req, res, ctx) => {
    return res(...commonTransformers(req, res, ctx))
  }),
  rest.get('https://example.com/test', (req, res, ctx) => res(...commonTransformers(req, res, ctx))),
)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

// Listen to make sure fetch is actually called.
// Use msw to stub out the req/res
const fetchSpy = vitest.spyOn(window, 'fetch')
const fetchSpyHeaders = (idx = 0) => fetchSpy.mock.calls[idx][1].headers
describe('useFetch', () => {
  beforeEach(() => {
    fetchSpy.mockClear()
  })

  test('should have status code of 200 and message of Hello World', async() => {
    const { statusCode, data } = useFetch('https://example.com?text=hello')

    await retry(() => {
      expect(fetchSpy).toHaveBeenCalledOnce()
      expect(data.value).toBe('hello')
      expect(statusCode.value).toBe(200)
    })
  })

  test('should be able to use the Headers object', async() => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'test')

    useFetch('https://example.com/', { headers: myHeaders })

    await retry(() => {
      expect(fetchSpy.mock.calls[0][1].headers).toEqual({ authorization: 'test' })
    })
  })

  test('should parse response as json', async() => {
    const { data } = useFetch('https://example.com?json').json()
    await retry(() => {
      expect(data.value).toEqual(jsonMessage)
    })
  })

  test('should have an error on 400', async() => {
    const { error, statusCode } = useFetch('https://example.com?status=400')

    await retry(() => {
      expect(statusCode.value).toBe(400)
      expect(error.value).toBe('Bad Request')
    })
  })

  test('should abort request and set aborted to true', async() => {
    const { aborted, abort, execute } = useFetch('https://example.com')
    setTimeout(() => abort(), 0)
    await retry(() => expect(aborted.value).toBe(true))
    execute()
    setTimeout(() => abort(), 0)
    await retry(() => expect(aborted.value).toBe(true))
  })

  test('should not call if immediate is false', async() => {
    useFetch('https://example.com', { immediate: false })
    await retry(() => expect(fetchSpy).toBeCalledTimes(0))
  })

  test('should refetch if refetch is set to true', async() => {
    const url = ref('https://example.com')
    useFetch(url, { refetch: true })
    url.value = 'https://example.com?text'
    await retry(() => expect(fetchSpy).toBeCalledTimes(2))
  })

  test('should auto refetch when the refetch is set to true and the payload is a ref', async() => {
    const param = ref({ num: 1 })
    useFetch('https://example.com', { refetch: true }).post(param)
    param.value.num = 2
    await retry(() => expect(fetchSpy).toBeCalledTimes(2))
  })

  test('should create an instance of useFetch with a base url', async() => {
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

  test('should run the beforeFetch function and add headers to the request', async() => {
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

  test('should run the beforeFetch function and cancel the request', async() => {
    const { execute } = useFetch('https://example.com', {
      immediate: false,
      beforeFetch({ cancel }) {
        cancel()
      },
    })

    await execute()
    expect(fetchSpy).toBeCalledTimes(0)
  })

  test('should run the afterFetch function', async() => {
    const { data } = useFetch('https://example.com?json', {
      afterFetch(ctx) {
        ctx.data.title = 'Hunter x Hunter'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(data.value).toEqual(expect.objectContaining({ title: 'Hunter x Hunter' }))
    })
  })

  test('should run the onFetchError function', async() => {
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

  test('should run the onFetchError function when network error', async() => {
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

  test('should emit onFetchResponse event', async() => {
    const onResponseSpy = vitest.fn()
    const { onFetchResponse } = useFetch('https://example.com')

    onFetchResponse(onResponseSpy)
    await retry(() => {
      expect(onResponseSpy).toHaveBeenCalledOnce()
    })
  })

  test('should emit onFetchResponse event', async() => {
    const onFetchErrorSpy = vitest.fn()
    const onFetchResponseSpy = vitest.fn()
    const onFetchFinallySpy = vitest.fn()

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

  test('should emit onFetchError event', async() => {
    const onFetchErrorSpy = vitest.fn()
    const onFetchResponseSpy = vitest.fn()
    const onFetchFinallySpy = vitest.fn()

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

  test('setting the request method w/ get and return type w/ json', async() => {
    const { data } = useFetch('https://example.com?json').get().json()
    await retry(() => expect(data.value).toEqual(jsonMessage))
  })

  test('setting the request method w/ post and return type w/ text', async() => {
    const { data } = useFetch('https://example.com?json').post().text()
    await retry(() => expect(data.value).toEqual(JSON.stringify(jsonMessage)))
  })

  test('allow setting response type before doing request', async() => {
    const shell = useFetch('https://example.com?json', {
      immediate: false,
    }).get().text()
    shell.json()
    shell.execute()
    await retry(() => expect(shell.data.value).toEqual(jsonMessage))
  })

  test('not allowed setting response type while doing request', async() => {
    const shell = useFetch('https://example.com?json').get().text()
    const { isFetching, data } = shell
    await until(isFetching).toBe(true)
    shell.json()
    await retry(() => expect(data.value).toEqual(JSON.stringify(jsonMessage)))
  })

  test('should abort request when timeout reached', async() => {
    const { aborted, execute } = useFetch('https://example.com?delay=100', { timeout: 10 })

    await retry(() => expect(aborted.value).toBeTruthy())
    await execute()
    await retry(() => expect(aborted.value).toBeTruthy())
  })

  test('should not abort request when timeout is not reached', async() => {
    const { data } = useFetch('https://example.com?json', { timeout: 100 }).json()
    await retry(() => expect(data.value).toEqual(jsonMessage))
  })

  test('should await request', async() => {
    const { data } = await useFetch('https://example.com?json').json()
    expect(data.value).toEqual(jsonMessage)
    expect(fetchSpy).toBeCalledTimes(1)
  })

  test('should await json response', async() => {
    const { data } = await useFetch('https://example.com?json').json()

    expect(data.value).toEqual(jsonMessage)
    expect(fetchSpy).toBeCalledTimes(1)
  })
})
