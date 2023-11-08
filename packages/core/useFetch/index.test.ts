import { until } from '@vueuse/shared'
import { nextTick, ref } from 'vue-demi'
import type { SpyInstance } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isBelowNode18, retry } from '../../.test'
import { createFetch, useFetch } from '.'
import '../../.test/mockServer'

const jsonMessage = { hello: 'world' }
const jsonUrl = `https://example.com?json=${encodeURI(JSON.stringify(jsonMessage))}`

// Listen to make sure fetch is actually called.
// Use msw to stub out the req/res
let fetchSpy = vi.spyOn(window, 'fetch') as SpyInstance<any>
let onFetchErrorSpy = vi.fn()
let onFetchResponseSpy = vi.fn()
let onFetchFinallySpy = vi.fn()

function fetchSpyHeaders(idx = 0) {
  return fetchSpy.mock.calls[idx][1]!.headers
}

// The tests does not run properly below node 18
describe.skipIf(isBelowNode18)('useFetch', () => {
  beforeEach(() => {
    fetchSpy = vi.spyOn(window, 'fetch')
    onFetchErrorSpy = vi.fn()
    onFetchResponseSpy = vi.fn()
    onFetchFinallySpy = vi.fn()
  })

  it('should have status code of 200 and message of Hello World', async () => {
    const { statusCode, data } = useFetch('https://example.com?text=hello')

    await retry(() => {
      expect(fetchSpy).toHaveBeenCalledOnce()
      expect(data.value).toBe('hello')
      expect(statusCode.value).toBe(200)
    })
  })

  it('should be able to use the Headers object', async () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', 'test')

    useFetch('https://example.com/', { headers: myHeaders })

    await retry(() => {
      expect(fetchSpyHeaders()).toEqual({ authorization: 'test' })
    })
  })

  it('should parse response as json', async () => {
    const { data } = useFetch(jsonUrl).json()
    await retry(() => {
      expect(data.value).toEqual(jsonMessage)
    })
  })

  it('should use custom fetch', async () => {
    let count = 0
    await useFetch('https://example.com/', {
      fetch: <typeof window.fetch>((input, init) => {
        count = 1
        return window.fetch(input, init)
      }),
    })

    expect(count).toEqual(1)
  })

  it('should use custom payloadType', async () => {
    let options: any
    useFetch('https://example.com', {
      beforeFetch: (ctx) => {
        options = ctx.options
      },
    }).post({ x: 1 }, 'unknown')

    await retry(() => {
      expect(fetchSpy).toHaveBeenCalledOnce()
      expect(options.body).toEqual({ x: 1 })
      expect(options.headers['Content-Type']).toBe('unknown')
    })
  })

  it('should have an error on 400', async () => {
    const { error, statusCode } = useFetch('https://example.com?status=400')

    await retry(() => {
      expect(statusCode.value).toBe(400)
      expect(error.value).toBe('Bad Request')
    })
  })

  it('should throw error', async () => {
    const options = { immediate: false }
    const error1 = await useFetch('https://example.com?status=400', options).execute(true).catch(err => err)
    const error2 = await useFetch('https://example.com?status=600', options).execute(true).catch(err => err)

    expect(error1.name).toBe('Error')
    expect(error1.message).toBe('Bad Request')
    expect(error2.name).toBe('Error')
  })

  it('should abort request and set aborted to true', async () => {
    const { aborted, abort, execute } = useFetch('https://example.com')
    setTimeout(() => abort(), 0)
    await retry(() => expect(aborted.value).toBe(true))
    execute()
    setTimeout(() => abort(), 0)
    await retry(() => expect(aborted.value).toBe(true))
  })

  it('should not call if immediate is false', async () => {
    useFetch('https://example.com', { immediate: false })
    await retry(() => expect(fetchSpy).toBeCalledTimes(0))
  })

  it('should refetch if refetch is set to true', async () => {
    const url = ref('https://example.com')
    useFetch(url, { refetch: true })
    url.value = 'https://example.com?text'
    await retry(() => expect(fetchSpy).toBeCalledTimes(2))
  })

  it('should auto refetch when the refetch is set to true and the payload is a ref', async () => {
    const param = ref({ num: 1 })
    useFetch('https://example.com', { refetch: true }).post(param)
    param.value.num = 2
    await retry(() => expect(fetchSpy).toBeCalledTimes(2))
  })

  it('should create an instance of useFetch with baseUrls', async () => {
    const baseUrl = 'https://example.com'
    const targetUrl = `${baseUrl}/test`
    const fetchHeaders = { Authorization: 'test' }
    const requestHeaders = { 'Accept-Language': 'en-US' }
    const allHeaders = { ...fetchHeaders, ...requestHeaders }
    const requestOptions = { headers: requestHeaders }
    const useMyFetchWithBaseUrl = createFetch({ baseUrl, fetchOptions: { headers: fetchHeaders } })
    const useMyFetchWithoutBaseUrl = createFetch({ fetchOptions: { headers: fetchHeaders } })

    useMyFetchWithBaseUrl('test', requestOptions)
    useMyFetchWithBaseUrl('/test', requestOptions)
    useMyFetchWithBaseUrl(targetUrl, requestOptions)
    useMyFetchWithoutBaseUrl(targetUrl, requestOptions)

    await retry(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(4)
      Array.from({ length: 4 }).fill(0).forEach((x, i) => {
        expect(fetchSpy).toHaveBeenNthCalledWith(i + 1, 'https://example.com/test', expect.anything())
      })
      expect(fetchSpyHeaders()).toMatchObject(allHeaders)
    })
  })

  it('should chain beforeFetch function when using a factory instance', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      options: {
        beforeFetch({ options }) {
          options.headers = { ...options.headers, Global: 'foo' }
          return { options }
        },
      },
    })
    useMyFetch('test', {
      beforeFetch({ options }) {
        options.headers = { ...options.headers, Local: 'foo' }
        return { options }
      },
    })

    await retry(() => {
      expect(fetchSpyHeaders()).toMatchObject({ Global: 'foo', Local: 'foo' })
    })
  })

  it('should chain afterFetch function when using a factory instance', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      options: {
        afterFetch(ctx) {
          ctx.data.title = 'Global'
          return ctx
        },
      },
    })
    const { data } = useMyFetch('test?json', {
      afterFetch(ctx) {
        ctx.data.title += ' Local'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(data.value).toEqual(expect.objectContaining({ title: 'Global Local' }))
    })
  })

  it('should chain onFetchError function when using a factory instance', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      options: {
        onFetchError(ctx) {
          ctx.error = 'Global'
          return ctx
        },
      },
    })
    const { error } = useMyFetch('test?status=400&json', {
      onFetchError(ctx) {
        ctx.error += ' Local'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(error.value).toEqual('Global Local')
    })
  })

  it('should chain beforeFetch function when using a factory instance and the options object in useMyFetch', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      options: {
        beforeFetch({ options }) {
          options.headers = { ...options.headers, Global: 'foo' }
          return { options }
        },
      },
    })
    useMyFetch(
      'test',
      { method: 'GET' },
      {
        beforeFetch({ options }) {
          options.headers = { ...options.headers, Local: 'foo' }
          return { options }
        },
      },
    )

    await retry(() => {
      expect(fetchSpyHeaders()).toMatchObject({ Global: 'foo', Local: 'foo' })
    })
  })

  it('should chain afterFetch function when using a factory instance and the options object in useMyFetch', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      options: {
        afterFetch(ctx) {
          ctx.data.title = 'Global'
          return ctx
        },
      },
    })
    const { data } = useMyFetch(
      'test?json',
      { method: 'GET' },
      {
        afterFetch(ctx) {
          ctx.data.title += ' Local'
          return ctx
        },
      },
    ).json()

    await retry(() => {
      expect(data.value).toEqual(expect.objectContaining({ title: 'Global Local' }))
    })
  })

  it('should chain onFetchError function when using a factory instance and the options object in useMyFetch', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      options: {
        onFetchError(ctx) {
          ctx.error = 'Global'
          return ctx
        },
      },
    })
    const { error } = useMyFetch(
      'test?status=400&json',
      { method: 'GET' },
      {
        onFetchError(ctx) {
          ctx.error += ' Local'
          return ctx
        },
      },
    ).json()

    await retry(() => {
      expect(error.value).toEqual('Global Local')
    })
  })

  it('should overwrite beforeFetch function when using a factory instance', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      combination: 'overwrite',
      options: {
        beforeFetch({ options }) {
          options.headers = { ...options.headers, Global: 'foo' }
          return { options }
        },
      },
    })
    useMyFetch('test', {
      beforeFetch({ options }) {
        options.headers = { ...options.headers, Local: 'foo' }
        return { options }
      },
    })

    await retry(() => {
      expect(fetchSpyHeaders()).toMatchObject({ Local: 'foo' })
    })
  })

  it('should overwrite afterFetch function when using a factory instance', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      combination: 'overwrite',
      options: {
        afterFetch(ctx) {
          ctx.data.global = 'Global'
          return ctx
        },
      },
    })
    const { data } = useMyFetch('test?json', {
      afterFetch(ctx) {
        ctx.data.local = 'Local'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(data.value).toEqual(expect.objectContaining({ local: 'Local' }))
      expect(data.value).toEqual(expect.not.objectContaining({ global: 'Global' }))
    })
  })

  it('should overwrite onFetchError function when using a factory instance', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      combination: 'overwrite',
      options: {
        onFetchError(ctx) {
          ctx.error = 'Global'
          return ctx
        },
      },
    })
    const { error } = useMyFetch('test?status=400&json', {
      onFetchError(ctx) {
        ctx.error = 'Local'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(error.value).toEqual('Local')
    })
  })

  it('should overwrite beforeFetch function when using a factory instance and the options object in useMyFetch', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      combination: 'overwrite',
      options: {
        beforeFetch({ options }) {
          options.headers = { ...options.headers, Global: 'foo' }
          return { options }
        },
      },
    })
    useMyFetch(
      'test',
      { method: 'GET' },
      {
        beforeFetch({ options }) {
          options.headers = { ...options.headers, Local: 'foo' }
          return { options }
        },
      },
    )

    await retry(() => {
      expect(fetchSpyHeaders()).toMatchObject({ Local: 'foo' })
    })
  })

  it('should overwrite afterFetch function when using a factory instance and the options object in useMyFetch', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      combination: 'overwrite',
      options: {
        afterFetch(ctx) {
          ctx.data.global = 'Global'
          return ctx
        },
      },
    })
    const { data } = useMyFetch(
      'test?json',
      { method: 'GET' },
      {
        afterFetch(ctx) {
          ctx.data.local = 'Local'
          return ctx
        },
      },
    ).json()

    await retry(() => {
      expect(data.value).toEqual(expect.objectContaining({ local: 'Local' }))
      expect(data.value).toEqual(expect.not.objectContaining({ global: 'Global' }))
    })
  })

  it('should overwrite onFetchError function when using a factory instance and the options object in useMyFetch', async () => {
    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      combination: 'overwrite',
      options: {
        onFetchError(ctx) {
          ctx.error = 'Global'
          return ctx
        },
      },
    })
    const { error } = useMyFetch(
      'test?status=400&json',
      { method: 'GET' },
      {
        onFetchError(ctx) {
          ctx.error = 'Local'
          return ctx
        },
      },
    ).json()

    await retry(() => {
      expect(error.value).toEqual('Local')
    })
  })

  it('should run the beforeFetch function and add headers to the request', async () => {
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

  it('should run the beforeFetch has default headers', async () => {
    useFetch('https://example.com', {
      beforeFetch({ options }) {
        expect(options.headers).toBeDefined()
        return { options }
      },
    })
  })

  it('should run the beforeFetch function and cancel the request', async () => {
    const { execute } = useFetch('https://example.com', {
      immediate: false,
      beforeFetch({ cancel }) {
        cancel()
      },
    })

    await execute()
    expect(fetchSpy).toBeCalledTimes(0)
  })

  it('should run the afterFetch function', async () => {
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

  it('async chained beforeFetch and afterFetch should be executed in order', async () => {
    const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

    const useMyFetch = createFetch({
      baseUrl: 'https://example.com',
      options: {
        async beforeFetch({ options }) {
          await sleep(50)
          options.headers = { ...options.headers, title: 'Hunter X Hunter' }
          return { options }
        },
        async afterFetch(ctx) {
          await sleep(50)
          ctx.data.message = 'Hunter X Hunter'
          return ctx
        },
      },
    })

    const { data } = await useMyFetch(
      'test?json',
      { method: 'GET' },
      {
        async beforeFetch({ options }) {
          await Promise.resolve()
          options.headers = { ...options.headers, title: 'Hello, VueUse' }
          return { options }
        },
        async afterFetch(ctx) {
          await Promise.resolve()
          ctx.data.message = 'Hello, VueUse'
          return ctx
        },
      },
    ).json()

    await retry(() => {
      expect(fetchSpyHeaders()).toMatchObject({ title: 'Hello, VueUse' })
      expect(data.value).toEqual(expect.objectContaining({ message: 'Hello, VueUse' }))
    })
  })

  it('should run the onFetchError function', async () => {
    const { data, error, statusCode } = useFetch('https://example.com?status=400&json', {
      onFetchError(ctx) {
        ctx.error = 'Internal Server Error'
        ctx.data = 'Internal Server Error'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(statusCode.value).toEqual(400)
      expect(error.value).toEqual('Internal Server Error')
      expect(data.value).toBeNull()
    })
  })

  it('should return data in onFetchError when updateDataOnError is true', async () => {
    const { data, error, statusCode } = useFetch('https://example.com?status=400&json', {
      updateDataOnError: true,
      onFetchError(ctx) {
        ctx.error = 'Internal Server Error'
        ctx.data = 'Internal Server Error'
        return ctx
      },
    }).json()

    await retry(() => {
      expect(statusCode.value).toEqual(400)
      expect(error.value).toEqual('Internal Server Error')
      expect(data.value).toEqual('Internal Server Error')
    })
  })

  it('should run the onFetchError function when network error', async () => {
    const { data, error, statusCode } = useFetch('https://example.com?status=500&text=Internal%20Server%20Error', {
      onFetchError(ctx) {
        ctx.error = 'Internal Server Error'

        return ctx
      },
    }).json()

    await retry(() => {
      expect(statusCode.value).toStrictEqual(500)
      expect(error.value).toEqual('Internal Server Error')
      expect(data.value).toBeNull()
    })
  })

  it('should emit onFetchResponse event', async () => {
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

  it('should emit onFetchError event', async () => {
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

  it('setting the request method w/ get and return type w/ json', async () => {
    const { data } = useFetch(jsonUrl).get().json()
    await retry(() => expect(data.value).toEqual(jsonMessage))
  })

  it('setting the request method w/ post and return type w/ text', async () => {
    const { data } = useFetch(jsonUrl).post().text()
    await retry(() => expect(data.value).toEqual(JSON.stringify(jsonMessage)))
  })

  it('allow setting response type before doing request', async () => {
    const shell = useFetch(jsonUrl, {
      immediate: false,
    }).get().text()
    shell.json()
    shell.execute()
    await retry(() => expect(shell.data.value).toEqual(jsonMessage))
  })

  it('not allowed setting request method and response type while doing request', async () => {
    const shell = useFetch(jsonUrl).get().text()
    const { isFetching, data } = shell
    await until(isFetching).toBe(true)
    shell.post()
    shell.json()
    await retry(() => {
      expect(fetchSpy).toHaveBeenCalledOnce()
      expect(data.value).toEqual(JSON.stringify(jsonMessage))
    })
  })

  it('should abort request when timeout reached', async () => {
    const { aborted, execute } = useFetch('https://example.com?delay=100', { timeout: 10 })

    await retry(() => expect(aborted.value).toBeTruthy())
    await execute()
    await retry(() => expect(aborted.value).toBeTruthy())
  })

  it('should not abort request when timeout is not reached', async () => {
    const { data } = useFetch(jsonUrl, { timeout: 100 }).json()
    await retry(() => expect(data.value).toEqual(jsonMessage))
  })

  it('should await request', async () => {
    const { data } = await useFetch(jsonUrl).get()
    expect(data.value).toEqual(JSON.stringify(jsonMessage))
    expect(fetchSpy).toBeCalledTimes(1)
  })

  it('should await json response', async () => {
    const { data } = await useFetch(jsonUrl).json()

    expect(data.value).toEqual(jsonMessage)
    expect(fetchSpy).toBeCalledTimes(1)
  })

  it('should abort previous request', async () => {
    const { onFetchResponse, execute } = useFetch('https://example.com', { immediate: false })

    onFetchResponse(onFetchResponseSpy)

    await Promise.all([
      execute(),
      execute(),
      execute(),
      execute(),
    ])

    await retry(() => {
      expect(onFetchResponseSpy).toBeCalledTimes(1)
    })
  })

  it('should listen url ref change abort previous request', async () => {
    const url = ref('https://example.com')
    const { onFetchResponse } = useFetch(url, { refetch: true, immediate: false })

    onFetchResponse(onFetchResponseSpy)

    url.value = 'https://example.com?t=1'
    await nextTick()
    url.value = 'https://example.com?t=2'
    await nextTick()
    url.value = 'https://example.com?t=3'

    await retry(() => {
      expect(onFetchResponseSpy).toBeCalledTimes(1)
    })
  })

  it('should be generated payloadType on execute', async () => {
    const form = ref()
    const { execute } = useFetch('https://example.com').post(form)

    form.value = { x: 1 }
    await execute()

    await retry(() => {
      expect(fetchSpyHeaders()['Content-Type']).toBe('application/json')
    })
  })

  it('should be generated payloadType on execute with formdata', async () => {
    const form = ref<any>({ x: 1 })
    const { execute } = useFetch('https://example.com').post(form)

    form.value = new FormData()
    await execute()

    await retry(() => {
      expect(fetchSpyHeaders()['Content-Type']).toBe(undefined)
    })
  })
})
