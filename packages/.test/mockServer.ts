/**
 * Network mocking with MSW.
 * Import this helper into the specific tests that need to make network requests.
 */

import { setupServer } from 'msw/node'
import type { RestContext, RestRequest } from 'msw'
import { rest } from 'msw'

const defaultJsonMessage = { hello: 'world' }
const defaultTextMessage = 'Hello World'
const baseUrl = 'https://example.com'

const commonTransformers = (req: RestRequest, _: any, ctx: RestContext) => {
  const t = []
  const qs = req.url.searchParams

  if (qs.get('delay'))
    t.push(ctx.delay(Number(qs.get('delay'))))
  if (qs.get('status'))
    t.push(ctx.status(Number(qs.get('status'))))
  if (qs.get('text') != null) {
    t.push(ctx.text(qs.get('text') ?? defaultTextMessage))
  }
  else if (qs.get('json') != null) {
    const jsonVal = qs.get('json')
    const jsonTransformer = ctx.json(jsonVal?.length ? JSON.parse(jsonVal) : defaultJsonMessage)
    t.push(jsonTransformer)
  }
  return t
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
export const server = setupServer(
  rest.post(baseUrl, (req, res, ctx) => {
    // Support all the normal examples (delay, status, text, and json)
    const t = commonTransformers(req, res, ctx)

    // Echo back the request payload
    if (typeof req.body === 'number' || typeof req.body === 'string')
      t.push(ctx.text(String(req.body)))
    else t.push(ctx.json(req.body))

    return res(...t)
  }),

  rest.get(baseUrl, (req, res, ctx) => res(...commonTransformers(req, res, ctx))),

  // Another duplicate route for the sole purpose of re-triggering requests on url change.
  rest.get(`${baseUrl}/test`, (req, res, ctx) => res(...commonTransformers(req, res, ctx))),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
