import type { Ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { onStartTyping } from './index'

describe('onStartTyping', () => {
  let element: Ref<HTMLInputElement>
  let callBackFn: any

  beforeEach(() => {
    element = shallowRef(document.createElement('input'))
    element.value.tabIndex = 1
    callBackFn = vi.fn()
  })

  function createKeyDownEvent(keyCode: number) {
    const ev = new KeyboardEvent('keydown', { keyCode })
    document.dispatchEvent(ev)
  }

  function range(size: number, startAt = 0) {
    return [...Array.from({ length: size }).keys()].map(i => i + startAt)
  }

  it('triggers callback with any letter', () => {
    const letters = range(26, 65)

    onStartTyping(callBackFn)

    letters.forEach((letter) => {
      document.body.focus()
      createKeyDownEvent(letter)
    })

    expect(callBackFn).toBeCalledTimes(letters.length)
  })

  it('triggers callback with any number', () => {
    const numbers = range(10, 48)
    const numpadNumbers = range(10, 96)

    onStartTyping(callBackFn)

    numbers.forEach((number) => {
      document.body.focus()
      createKeyDownEvent(number)
    })

    numpadNumbers.forEach((number) => {
      document.body.focus()
      createKeyDownEvent(number)
    })

    expect(callBackFn).toBeCalledTimes(numbers.length + numpadNumbers.length)
  })
})
