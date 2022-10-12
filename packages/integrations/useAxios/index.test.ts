import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useAxios } from '.'

describe('useAxios', () => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1'
  const config: AxiosRequestConfig = {
    method: 'GET',
  }
  const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
  })
  const options = { immediate: false }
  const path = '/todos/1'
  test('params: url', async () => {
    const { isFinished, data, then } = useAxios(url)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(data.value.id).toBe(1)
      expect(result.data).toBe(data)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('params: url config', async () => {
    const { isFinished, then } = useAxios(url, config)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vitest.fn()

    await then()
      .then((result) => {
        expect(result.data.value.id).toBe(1)
        expect(isFinished.value).toBeTruthy()
        expect(onRejected).toBeCalledTimes(0)
      }, onRejected)
  })

  test('params: url config options', async () => {
    const { isLoading, execute, then } = useAxios(url, config, options)
    expect(isLoading.value).toBeFalsy()
    execute('https://jsonplaceholder.typicode.com/todos/2')
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    const result = await then(undefined, onRejected)
    expect(result.data.value.id).toBe(2)
    expect(isLoading.value).toBeFalsy()
    expect(onRejected).toBeCalledTimes(0)
  })

  test('params: url instance', async () => {
    const { isFinished, then } = useAxios(path, instance)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('params: url instance options', async () => {
    const { isLoading, execute, then } = useAxios(path, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('params: url config instance', async () => {
    const { isFinished, then } = useAxios(path, config, instance)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('params: url config instance options', async () => {
    const { isLoading, then, execute } = useAxios(path, config, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('params: url config instance options, execute: config', async () => {
    const { isLoading, then, execute } = useAxios(path, config, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute(undefined, config)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('params no url: nil', async () => {
    const { isLoading, execute } = useAxios()
    expect(isLoading.value).toBeFalsy()
    const { then } = execute(url)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('params no url: config', async () => {
    const { isLoading, execute } = useAxios(config)
    expect(isLoading.value).toBeFalsy()
    const { then } = execute(url)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    const result = await then(undefined, onRejected)
    expect(result.data.value.id).toBe(1)
    expect(isLoading.value).toBeFalsy()
    expect(onRejected).toBeCalledTimes(0)
  })

  test('params no url: instance', async () => {
    const { isLoading, execute } = useAxios(instance)
    expect(isLoading.value).toBeFalsy()
    const { then } = execute(path)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('params no url: config instance', async () => {
    const { isLoading, execute } = useAxios(config, instance)
    expect(isLoading.value).toBeFalsy()
    const res = execute(path)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    const result = await res.then(undefined, onRejected)
    expect(result.data.value.id).toBe(1)
    expect(isLoading.value).toBeFalsy()
    expect(onRejected).toBeCalledTimes(0)
    expect(isLoading.value).toBeFalsy()
  })

  test('execute is awaitable', async () => {
    const { isLoading, then, execute } = useAxios(config, instance)
    expect(isLoading.value).toBeFalsy()
    execute(path)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('calling axios with config change(param/data etc.) only', async () => {
    const { isLoading, then, execute } = useAxios('/comments', config, instance, options)
    expect(isLoading.value).toBeFalsy()
    const paramConfig: AxiosRequestConfig = { params: { postId: 1 } }
    execute(paramConfig)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data.value[0].postId).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)

    paramConfig.params = { postId: 2 }
    execute(paramConfig)
    expect(isLoading.value).toBeTruthy()

    await then((result) => {
      expect(result.data.value[0].postId).toBe(2)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  test('use generic type', async () => {
    interface ReqType {
      title: string
      body: string
      userId: number
    }

    interface ResType {
      id: number
      title: string
      body: string
      userId: number
    }
    const typeConfig: AxiosRequestConfig<ReqType> = {
      method: 'POST',
    }
    const { isLoading, then, execute } = useAxios<ResType, ReqType>('/posts', typeConfig, instance, options)
    expect(isLoading.value).toBeFalsy()
    const requestData: ReqType = {
      title: 'title',
      body: 'body',
      userId: 123,
    }
    execute({ data: requestData })
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    await then((result) => {
      expect(result.data).toBeDefined()
      expect(result.data.value?.title).toBe('title')
      expect(result.data.value?.body).toBe('body')
      expect(result.data.value?.userId).toBe(123)
      expect(result.data.value?.id).toBeDefined()
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })
})
