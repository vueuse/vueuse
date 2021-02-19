import { useFetch } from '.'

describe('useFetch', () => {
  const urls = {
    get: 'https://httpbin.org/get',
    post: 'https://httpbin.org/get',
    error: 'https://httpbin.org/status/500',
  }

  test('basic get request', async() => {
    const { statusCode } = useFetch(urls.get)

    /**
     * Since we are using refs here not sure about the best way to wait for a change?
     * Is there a defined way to do this yet or should we make some sort of util?
     *
     * If there isn't maybe we could have a util that does something like
     *
     * await waitForRefChange(statusCode)
     *
     * expect(statusCode.value).toBe(200)
     */
  })
})
