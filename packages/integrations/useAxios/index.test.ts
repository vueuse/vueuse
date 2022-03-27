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
  test('params: url', (done) => {
    const { isFinished, data, then } = useAxios(url)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(data.value.id).toBe(1)
      expect(result.data).toBe(data)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params: url config', (done) => {
    const { isFinished, then } = useAxios(url, config)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vitest.fn()

    then()
      .then((result) => {
        expect(result.data.value.id).toBe(1)
        expect(isFinished.value).toBeTruthy()
        expect(onRejected).toBeCalledTimes(0)
        done()
      }, onRejected)
  })

  test('params: url config options', (done) => {
    const { isLoading, execute, then } = useAxios(url, config, options)
    expect(isLoading.value).toBeFalsy()
    execute('https://jsonplaceholder.typicode.com/todos/2')
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(2)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params: url instance', (done) => {
    const { isFinished, then } = useAxios(path, instance)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params: url instance options', (done) => {
    const { isLoading, execute, then } = useAxios(path, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params: url config instance', (done) => {
    const { isFinished, then } = useAxios(path, config, instance)
    expect(isFinished.value).toBeFalsy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isFinished.value).toBeTruthy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params: url config instance options', (done) => {
    const { isLoading, then, execute } = useAxios(path, config, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params: url config instance options, execute: config', (done) => {
    const { isLoading, then, execute } = useAxios(path, config, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute(config)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params no url: nil', (done) => {
    const { isLoading, then, execute } = useAxios()
    expect(isLoading.value).toBeFalsy()
    execute(url)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params no url: config', (done) => {
    const { isLoading, then, execute } = useAxios(config)
    expect(isLoading.value).toBeFalsy()
    execute(url)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    then()
      .then((result) => {
        expect(result.data.value.id).toBe(1)
        expect(isLoading.value).toBeFalsy()
        expect(onRejected).toBeCalledTimes(0)
        done()
      }, onRejected)
  })

  test('params no url: instance', (done) => {
    const { isLoading, then, execute } = useAxios(instance)
    expect(isLoading.value).toBeFalsy()
    execute(url)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })

  test('params no url: config instance', (done) => {
    const { isLoading, then, execute } = useAxios(config, instance)
    expect(isLoading.value).toBeFalsy()
    execute(path)
    expect(isLoading.value).toBeTruthy()
    const onRejected = vitest.fn()

    then((result) => {
      expect(result.data.value.id).toBe(1)
      expect(isLoading.value).toBeFalsy()
      expect(onRejected).toBeCalledTimes(0)
      done()
    }, onRejected)
  })
})
