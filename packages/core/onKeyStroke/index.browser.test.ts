import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { onKeyStroke } from './index'

describe('onKeyStroke', () => {
  let callBackFn: any

  beforeEach(() => {
    callBackFn = vi.fn()
  })

  it('listen to single key', async () => {
    onKeyStroke('a', callBackFn)
    await userEvent.keyboard('ab')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('listen to multi keys', async () => {
    onKeyStroke(['a', 'b', 'c'], callBackFn)
    await userEvent.keyboard('abcd')
    expect(callBackFn).toBeCalledTimes(3)
  })

  it('use function filter', async () => {
    const filter = (event: KeyboardEvent) => {
      return event.key === 'a'
    }
    onKeyStroke(filter, callBackFn)
    await userEvent.keyboard('abc')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('listen to all keys by boolean', async () => {
    onKeyStroke(true, callBackFn)
    await userEvent.keyboard('abcde')
    expect(callBackFn).toBeCalledTimes(5)
  })

  it('listen to all keys by constructor', async () => {
    onKeyStroke(callBackFn)
    await userEvent.keyboard('abcde')
    expect(callBackFn).toBeCalledTimes(5)
  })

  it('listen to keypress', async () => {
    onKeyStroke('a', callBackFn, { eventName: 'keypress' })
    await userEvent.keyboard('a>5')
    await userEvent.keyboard('b')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('ignore repeated events', async () => {
    onKeyStroke('a', callBackFn, { dedupe: true })
    await userEvent.keyboard('{a>5/}')
    expect(callBackFn).toBeCalledTimes(1)
  })
})
