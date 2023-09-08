import type { RawAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { isBelowNode18 } from '../../.test'
import { useAxios } from '.'

// The tests does not run properly below node 18
describe.skipIf(isBelowNode18)('useAxios', () => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1'
  const config: RawAxiosRequestConfig = {
    method: 'GET',
  }
  const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
  })
  const options = { immediate: false }
  const path = '/todos/1'
  it('params: url', async () => {
    const { isFinished, data, then } = useAxios(url)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(data.value.id).toBe(1)
      expect(result.data).toBe(data)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  it('params: url config', async () => {
    const { isFinished, then } = useAxios(url, config)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vi.fn()

    await then()
      .then((result) => {
        expect(result.data.value.id).toBe(1)
        expect(isFinished.value).toBeTruthy()
        expect(onRejected).toBeCalledTimes(0)
      }, onRejected)
  })

  it('params: url config options', async () => {
    const { isLoading, execute, then } = useAxios(url, config, options)
    expect(isLoading.value).toBeFalsy()
    execute('https://jsonplaceholder.typicode.com/todos/2')
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    const result = await then(undefined, onRejected)
    expect(result.data.value.id).toBe(2)
    expect(isLoading.value).toBeFalsy()
    expect(onRejected).toBeCalledTimes(0)
  })

  it('params: url instance', async () => {
    const { isFinished, then } = useAxios(path, instance)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  it('params: url instance options', async () => {
    const { isLoading, execute, then } = useAxios(path, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  it('params: url config instance', async () => {
    const { isFinished, then } = useAxios(path, config, instance)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  it('params: url config instance options', async () => {
    const { isLoading, then, execute } = useAxios(path, config, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  it('params: url config instance options, execute: config', async () => {
    const { isLoading, then, execute } = useAxios(path, config, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute(undefined, config)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  it('params no url: nil', async () => {
    const { isLoading, execute } = useAxios()
    expect(isLoading.value).toBeFalsy()
    const { then } = execute(url)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  it('params no url: config', async () => {
    const { isLoading, execute } = useAxios(config)
    expect(isLoading.value).toBeFalsy()
    const { then } = execute(url)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    const result = await then(undefined, onRejected)
    expect(result.data.value.id).toBe(1)
    expect(isLoading.value).toBeFalsy()
    expect(onRejected).toBeCalledTimes(0)
  })

  it('params no url: instance', async () => {
    const { isLoading, execute } = useAxios(instance)
    expect(isLoading.value).toBeFalsy()
    const { then } = execute(path)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
    }, onRejected)
  })

  it('params no url: config instance', async () => {
    const { isLoading, execute } = useAxios(config, instance)
    expect(isLoading.value).toBeFalsy()
    const res = execute(path)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    const result = await res.then(undefined, onRejected)
    expect(result.data.value.id).toBe(1)
    expect(isLoading.value).toBeFalsy()
    expect(onRejected).toBeCalledTimes(0)
    expect(isLoading.value).toBeFalsy()
  })

  it('execute is awaitable', async () => {
    const { isLoading, then, execute } = useAxios(config, instance)
    expect(isLoading.value).toBeFalsy()
    execute(path)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

    await then((result) => {
      expect(result.data.value.id).toBe(1)
    }, onRejected)
    expect(isLoading.value).toBeFalsy()

    expect(onRejected).toBeCalledTimes(0)
  })

  it('execute rejects on error', async () => {
    const { isLoading, then, execute } = useAxios(config, instance)
    expect(isLoading.value).toBeFalsy()
    execute(`${path}/wrong-url`)
    expect(isLoading.value).toBeTruthy()
    const onResolved = vi.fn()
    const onRejected = vi.fn()

    await then(onResolved, onRejected)
    expect(isLoading.value).toBeFalsy()
    expect(onResolved).toBeCalledTimes(0)
    expect(onRejected).toBeCalledTimes(1)
  })

  it('calling axios with config change(param/data etc.) only', async () => {
    const { isLoading, then, execute } = useAxios('/comments', config, instance, options)
    expect(isLoading.value).toBeFalsy()
    const paramConfig: RawAxiosRequestConfig = { params: { postId: 1 } }
    execute(paramConfig)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vi.fn()

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

  it('use generic type', async () => {
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
    const typeConfig: RawAxiosRequestConfig<ReqType> = {
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
    const onRejected = vi.fn()

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

  it('should not abort when finished', async () => {
    const { isLoading, isFinished, isAborted, execute, abort } = useAxios(url, config, options)
    expect(isLoading.value).toBeFalsy()
    await execute('https://jsonplaceholder.typicode.com/todos/2')
    expect(isFinished.value).toBeTruthy()
    expect(isLoading.value).toBeFalsy()
    abort()
    expect(isAborted.value).toBeFalsy()
  })

  it('should abort when loading', async () => {
    const { isLoading, isFinished, isAborted, execute, abort } = useAxios(url, config, options)
    expect(isLoading.value).toBeFalsy()
    let error: any
    const promise = execute('https://jsonplaceholder.typicode.com/todos/2')
      .catch((e) => {
        error = e
      })
    abort('aborted')
    await promise
    expect(isAborted.value).toBeTruthy()
    expect(isFinished.value).toBeTruthy()
    expect(error).toBeDefined()
  })

  it('should be loading on re-execute', async () => {
    const onError = vi.fn()
    const { isLoading, execute } = useAxios(url, config, { ...options, onError })

    execute().catch(() => {})
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(isLoading.value).toBeTruthy()

    execute().catch(() => {})
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(isLoading.value).toBeTruthy()

    await execute().catch(() => {})
    expect(isLoading.value).toBeFalsy()
    expect(onError).toBeCalledTimes(2)
  })

  it('missing url', async () => {
    // prevent stderr in jsdom xhr
    console.error = vi.fn()
    // @ts-expect-error mock undefined url
    const { execute } = useAxios(undefined, config, options)
    let error: any
    await execute()
      .catch(e => error = e)
    expect(error).toBeDefined()
  })

  it('should call onSuccess when success', async () => {
    const onSuccess = vi.fn()
    const { execute, isLoading, isFinished, data } = useAxios(url, config, { ...options, onSuccess })
    expect(isLoading.value).toBeFalsy()
    await execute()
    expect(onSuccess).toHaveBeenCalledWith(data.value)
    expect(isFinished.value).toBeTruthy()
    expect(isLoading.value).toBeFalsy()
  })

  it('should call onError when error', async () => {
    const onError = vi.fn()
    const { execute, error, isLoading, isFinished } = useAxios(url, config, { ...options, onError })
    expect(isLoading.value).toBeFalsy()
    await execute('https://jsonplaceholder.typicode.com/todos/2/3')
      .catch(() => {})
    expect(onError).toHaveBeenCalledWith(error.value)
    expect(isFinished.value).toBeTruthy()
    expect(isLoading.value).toBeFalsy()
  })

  it('should use initialData', async () => {
    const { data } = useAxios(url, config, { ...options, initialData: { value: 1 } })
    expect(data.value).toEqual({ value: 1 })
  })

  it('should reset data when execute', async () => {
    interface ResType {
      id: number
      title: string
      body: string
      userId: number
    }
    const initialData: ResType = {
      id: 2,
      title: 'title',
      body: 'body',
      userId: 2,
    }
    const { data, execute } = useAxios<ResType>(url, config, { ...options, initialData, resetOnExecute: true })
    expect(data.value).toEqual(initialData)
    await execute().catch(() => {})
    expect(data.value).toEqual({ completed: false, id: 1, title: 'delectus aut autem', userId: 1 })
    await execute('/todos/312').catch(() => {})
    expect(data.value).toEqual(initialData)
  })

  it('should not reset data when execute', async () => {
    interface ResType {
      id: number
      title: string
      body: string
      userId: number
    }
    const initialData: ResType = {
      id: 2,
      title: 'title',
      body: 'body',
      userId: 2,
    }
    const { data, execute } = useAxios<ResType>(url, config, { ...options, initialData })
    expect(data.value).toEqual(initialData)
    await execute().catch(() => {})
    expect(data.value).toEqual({ completed: false, id: 1, title: 'delectus aut autem', userId: 1 })
    await execute('/todos/312').catch(() => {})
    expect(data.value).toEqual({ completed: false, id: 1, title: 'delectus aut autem', userId: 1 })
  })

  it('should call onFinish', async () => {
    const onFinish = vi.fn()
    const { execute, isLoading, isFinished } = useAxios(url, config, { ...options, onFinish })
    expect(isLoading.value).toBeFalsy()

    await execute()
    expect(onFinish).toHaveBeenCalled()
    expect(isFinished.value).toBeTruthy()
    expect(isLoading.value).toBeFalsy()
  })
})
