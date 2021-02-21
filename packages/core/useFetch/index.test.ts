import { useFetch } from '.'

describe('useFetch', () => {
  const urls = {
    get: 'https://httpbin.org/get',
    post: 'https://httpbin.org/get',
    error: 'https://httpbin.org/status/500',
  }

  test('basic get request', async() => {
    const { statusCode, execute } = useFetch(urls.get, { immediate: false })

    await execute()

    expect(statusCode.value).toBe(200)
  })
})
