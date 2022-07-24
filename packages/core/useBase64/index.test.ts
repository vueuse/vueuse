import { useBase64 } from '@vueuse/core'
import { describe, expect } from 'vitest'

function decode(encoded: string) {
  const decodedStr = Buffer.from(encoded.split(',')[1], 'base64').toString('utf-8')

  if (!decodedStr)
    return ''

  return JSON.parse(decodedStr)
}

describe('useBase64', () => {
  it('should work with record', async () => {
    const template = { test: 5 }

    const { promise, base64 } = useBase64(template)

    await promise.value

    expect(decode(base64.value)).toEqual(template)
  })

  it('should work with map and default serialize function', async () => {
    const map = new Map([['test', 1]])

    const { promise, base64 } = useBase64(map)

    await promise.value

    expect(decode(base64.value)).toEqual(Object.fromEntries(map))
  })

  it('should work with set', async () => {
    const set = new Set([1])

    const { promise, base64 } = useBase64(set)

    await promise.value

    expect(decode(base64.value)).toEqual(Array.from(set))
  })

  it('should work with array', async () => {
    const arr = [1, 2, 3]

    const { promise, base64 } = useBase64(arr)

    await promise.value

    expect(decode(base64.value)).toEqual(arr)
  })

  it('should work with custom serialize function', async () => {
    const arr = [1, 2, 3]

    const serializer = (arr: number[]) => {
      return JSON.stringify(arr.map(el => el * 2))
    }

    const { promise, base64 } = useBase64(arr, { serializer })

    await promise.value

    expect(decode(base64.value)).toEqual(JSON.parse(serializer(arr)))
  })
})
