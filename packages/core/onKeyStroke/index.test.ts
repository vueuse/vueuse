import { beforeEach, describe, expect, it, vi } from 'vitest'
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

  function createKeyEvent(key: string, type: KeyStrokeEventName, repeat = false) {
    const ev = new KeyboardEvent(type, { key, repeat })
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

  it('ignore repeated events', () => {
    onKeyStroke('A', callBackFn, { target: element, dedupe: true })
    createKeyEvent('A', 'keydown', false)
    createKeyEvent('A', 'keydown', true)
    createKeyEvent('A', 'keydown', true)
    createKeyEvent('A', 'keydown', true)
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('should ignore with inline tags', () => {
    onKeyStroke('A', callBackFn, { target: element, ignoreElements: ['div'] })
    createKeyEvent('A', 'keydown')
    expect(callBackFn).toBeCalledTimes(0)
  })

  it('should not ignore with not targeted inline tags', () => {
    onKeyStroke('A', callBackFn, { target: element, ignoreElements: ['span', 'section', 'form'] })
    createKeyEvent('A', 'keydown')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('should ignore with ref inline tags', () => {
    onKeyStroke('A', callBackFn, { target: element, ignoreElements: [ref('div')] })
    createKeyEvent('A', 'keydown')
    expect(callBackFn).toBeCalledTimes(0)
  })

  it('should ignore with function', () => {
    onKeyStroke('A', callBackFn, { target: element, ignoreElements: [() => true] })
    createKeyEvent('A', 'keydown')
    createKeyEvent('A', 'keydown')

    expect(callBackFn).toBeCalledTimes(0)
  })

  it('should not ignore with function returned false', () => {
    onKeyStroke('A', callBackFn, { target: element, ignoreElements: [() => false] })
    createKeyEvent('A', 'keydown')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('should ignore with HTMLElement', () => {
    onKeyStroke('A', callBackFn, { target: element, ignoreElements: [element.value] })
    createKeyEvent('A', 'keydown')
    expect(callBackFn).toBeCalledTimes(0)
  })

  it('should ignore with ref HTMLElement', () => {
    onKeyStroke('A', callBackFn, { target: element, ignoreElements: [element] })
    createKeyEvent('A', 'keydown')
    expect(callBackFn).toBeCalledTimes(0)
  })

  it('should not ignore with not targeted HTMLElement', () => {
    const anotherEl = ref(document.createElement('div'))

    onKeyStroke('A', callBackFn, { target: element, ignoreElements: [anotherEl.value] })
    createKeyEvent('A', 'keydown')
    expect(callBackFn).toBeCalledTimes(1)
  })

  it('should work with several cases', () => {
    const anotherEl = ref(document.createElement('div'))

    onKeyStroke('A', callBackFn, {
      target: element,
      ignoreElements: [
        anotherEl.value, 'input', () => false],
    })

    createKeyEvent('A', 'keydown')
    createKeyEvent('A', 'keydown')
    expect(callBackFn).toBeCalledTimes(2)
  })
})
