import { delay, http, HttpResponse } from 'msw'
/**
 * Network mocking with MSW.
 * Import this helper into the specific tests that need to make network requests.
 */
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

const defaultJsonMessage = { hello: 'world' }
const defaultTextMessage = 'Hello World'
export const baseUrl = 'https://example.com'

async function commonTransformers(req: Request) {
  const url = new URL(req.url)
  const qs = url.searchParams

  let status = 200

  if (qs.get('delay'))
    await delay(Number(qs.get('delay')))
  if (qs.get('status')) {
    status = Number(qs.get('status'))
  }
  if (qs.get('text') != null) {
    return new HttpResponse(qs.get('text') ?? defaultTextMessage, { status })
  }
  else if (qs.get('json') != null) {
    const jsonVal = qs.get('json')
    return HttpResponse.json(jsonVal?.length ? JSON.parse(jsonVal) : defaultJsonMessage, { status })
  }

  return HttpResponse.json(defaultJsonMessage, { status })
}

/**
 * Allow the client to define the response body.
 * @example https://example.com?status=400 will respond with { status: 400 }.
 * @example https://example.com?json will respond with the default json message ({ hello: 'world' }).
 * @example https://example.com?text will respond with the default text message ('Hello World').
 * @example https://example.com?delay=1000 will respond in 1000ms.
 * @example https://example.com?status=301&text=thanks&delay=1000
 *          will respond in 1000ms with statusCode 300 and the response body "thanks" as a string
 */
const server = setupServer(
  http.post(baseUrl, async ({ request }) => {
    const url = new URL(request.url)
    const qs = url.searchParams
    let status = 200
    if (qs.get('status'))
      status = Number(qs.get('status'))

    const text = await request.text()
    const json = text.startsWith('{') ? JSON.parse(text) : null

    // Echo back the request payload
    if (json)
      return HttpResponse.json(json, { status })
    else if (typeof request.body === 'number' || typeof request.body === 'string')
      return new HttpResponse(text, { status })

    // Support all the normal examples (delay, status, text, and json)
    return commonTransformers(request)
  }),

  http.get(baseUrl, ({ request }) => {
    return commonTransformers(request)
  }),

  // Another duplicate route for the sole purpose of re-triggering requests on url change.
  http.get(`${baseUrl}/test`, ({ request }) => {
    return commonTransformers(request)
  }),

  http.get('https://jsonplaceholder.typicode.com/todos/1', () => {
    return HttpResponse.json({
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    })
  }),

  http.get('https://jsonplaceholder.typicode.com/todos/2', () => {
    return HttpResponse.json({
      userId: 2,
      id: 2,
      title: 'quis ut nam facilis et officia qui',
      completed: false,
    })
  }),

  http.get('https://jsonplaceholder.typicode.com/todos/3', () => {
    return HttpResponse.json({
      userId: 3,
      id: 3,
      title: 'fugiat veniam minus',
      completed: false,
    })
  }),

  http.get('https://jsonplaceholder.typicode.com/todos/1/wrong-url', () => {
    return HttpResponse.json({}, { status: 404 })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
