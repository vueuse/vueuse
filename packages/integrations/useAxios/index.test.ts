import { watch } from 'vue-demi'
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
    const { isFinished, data } = useAxios(url)
    expect(isFinished.value).toBeFalsy()
    watch(
      () => data.value,
      (result) => {
        expect(Object.keys(result).length > 0).toBeTruthy()
        // macrotask
        setTimeout(() => {
          expect(isFinished.value).toBeTruthy()
          done()
        })
      },
    )
  })

  test('params: url config', (done) => {
    const { isFinished, data } = useAxios(url, config)
    expect(isFinished.value).toBeFalsy()
    watch(
      () => data.value,
      (result) => {
        expect(Object.keys(result).length > 0).toBeTruthy()
        // macrotask
        setTimeout(() => {
          expect(isFinished.value).toBeTruthy()
          done()
        })
      },
    )
  })

  test('params: url config options', (done) => {
    const { isLoading, data, execute } = useAxios(url, config, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    watch(
      () => data.value,
      (result) => {
        expect(Object.keys(result).length > 0).toBeTruthy()
        // macrotask
        setTimeout(() => {
          expect(isLoading.value).toBeFalsy()
          done()
        })
      },
    )
  })

  test('params: url instance', (done) => {
    const { isFinished, data } = useAxios(path, instance)
    expect(isFinished.value).toBeFalsy()
    watch(
      () => data.value,
      (result) => {
        expect(Object.keys(result).length > 0).toBeTruthy()
        // macrotask
        setTimeout(() => {
          expect(isFinished.value).toBeTruthy()
          done()
        })
      },
    )
  })

  test('params: url instance options', (done) => {
    const { isLoading, data, execute } = useAxios(path, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    watch(
      () => data.value,
      (result) => {
        expect(Object.keys(result).length > 0).toBeTruthy()
        // macrotask
        setTimeout(() => {
          expect(isLoading.value).toBeFalsy()
          done()
        })
      },
    )
  })

  test('params: url config instance', (done) => {
    const { isFinished, data } = useAxios(path, config, instance)
    expect(isFinished.value).toBeFalsy()
    watch(
      () => data.value,
      (result) => {
        expect(Object.keys(result).length > 0).toBeTruthy()
        // macrotask
        setTimeout(() => {
          expect(isFinished.value).toBeTruthy()
          done()
        })
      },
    )
  })

  test('params: url config instance options', (done) => {
    const { isLoading, data, execute } = useAxios(path, config, instance, options)
    expect(isLoading.value).toBeFalsy()
    execute()
    expect(isLoading.value).toBeTruthy()
    watch(
      () => data.value,
      (result) => {
        expect(Object.keys(result).length > 0).toBeTruthy()
        // macrotask
        setTimeout(() => {
          expect(isLoading.value).toBeFalsy()
          done()
        })
      },
    )
  })
})
