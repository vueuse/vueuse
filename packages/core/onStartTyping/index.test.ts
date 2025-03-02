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

  function dispatchKeyDownEvent(keyCode: number) {
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
      dispatchKeyDownEvent(letter)
    })

    expect(callBackFn).toBeCalledTimes(letters.length)
  })

  it('triggers callback with any number', () => {
    const numbers = range(10, 48)
    const numpadNumbers = range(10, 96)

    onStartTyping(callBackFn)

    numbers.forEach((number) => {
      document.body.focus()
      dispatchKeyDownEvent(number)
    })

    numpadNumbers.forEach((number) => {
      document.body.focus()
      dispatchKeyDownEvent(number)
    })

    expect(callBackFn).toBeCalledTimes(numbers.length + numpadNumbers.length)
  })

  it('does not trigger callback with invalid characters', () => {
    const arrows = range(4, 37)
    const functionKeys = range(32, 112)

    onStartTyping(callBackFn)

    arrows.forEach((arrow) => {
      document.body.focus()
      dispatchKeyDownEvent(arrow)
    })

    functionKeys.forEach((functionKey) => {
      document.body.focus()
      dispatchKeyDownEvent(functionKey)
    })

    expect(callBackFn).toBeCalledTimes(0)
  })
})
