import { describe, expect, it } from 'vitest'
import { useBase64 } from '.'

describe('useBase64', () => {
  it('should work with record', async () => {
    const template = { test: 5 }

    const { promise, base64 } = useBase64(template)

    await promise.value

    expect(base64.value).toMatchInlineSnapshot(`"data:application/json;base64,eyJ0ZXN0Ijo1fQ=="`)
  })

  it('should work with map and default serialize function', async () => {
    const map = new Map([['test', 1]])

    const { promise, base64 } = useBase64(map)

    await promise.value

    expect(base64.value).toMatchInlineSnapshot(`"data:application/json;base64,eyJ0ZXN0IjoxfQ=="`)
  })

  it('should work with set', async () => {
    const set = new Set([1])

    const { promise, base64 } = useBase64(set)

    await promise.value

    expect(base64.value).toMatchInlineSnapshot(`"data:application/json;base64,WzFd"`)
  })

  it('should work with array', async () => {
    const arr = [1, 2, 3]

    const { promise, base64 } = useBase64(arr)

    await promise.value

    expect(base64.value).toMatchInlineSnapshot(`"data:application/json;base64,WzEsMiwzXQ=="`)
  })

  it('should work with custom serialize function', async () => {
    const arr = [1, 2, 3]

    const serializer = (arr: number[]) => {
      return JSON.stringify(arr.map(el => el * 2))
    }

    const { promise, base64 } = useBase64(arr, { serializer })

    await promise.value

    expect(base64.value).toMatchInlineSnapshot(`"data:application/json;base64,WzIsNCw2XQ=="`)
  })

  it('should work with dataUrl false', async () => {
    const arr = [1, 2, 3]

    const { promise, base64 } = useBase64(arr, { dataUrl: false })

    await promise.value

    expect(base64.value).toMatchInlineSnapshot(`"WzEsMiwzXQ=="`)
  })
})
