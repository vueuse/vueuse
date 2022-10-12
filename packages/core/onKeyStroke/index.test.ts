import { vi } from 'vitest'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { KeyStrokeEventName } from '.'
import { onKeyStroke } from '.'

describe('onKeyStroke', () => {
  let element: Ref<HTMLElement>
  let callBackFn: any

  beforeEach(() => {
    element = ref(document.createElement('div'))
    callBackFn = vi.fn()
  })

  function createKeyEvent(key: string, type: KeyStrokeEventName) {
    const ev = new KeyboardEvent(type, { key })
    element.value.dispatchEvent(ev)
  }

  it('listen to single key', () => {
    onKeyStroke('A', callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('listen to multi keys', () => {
    onKeyStroke(['A', 'B', 'C'], callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    createKeyEvent('D', 'keydown')
    expect(callBackFn).toBeCalledTimes(3)
  })

  it('use function filter', () => {
    const filter = (event: KeyboardEvent) => {
      return event.key === 'A'
    }
    onKeyStroke(filter, callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('listen to all keys by boolean', () => {
    onKeyStroke(true, callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    createKeyEvent('D', 'keydown')
    createKeyEvent('E', 'keydown')
    expect(callBackFn).toBeCalledTimes(5)
  })

  it('listen to all keys by constructor', () => {
    onKeyStroke(callBackFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    createKeyEvent('D', 'keydown')
    createKeyEvent('E', 'keydown')
    expect(callBackFn).toBeCalledTimes(5)
  })

  it('listen to keypress', () => {
    onKeyStroke('A', callBackFn, { target: element, eventName: 'keypress' })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('A', 'keypress')
    createKeyEvent('B', 'keypress')
    expect(callBackFn).toBeCalledTimes(1)
  })
})
