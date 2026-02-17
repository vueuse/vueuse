import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { onStartTyping } from './index'

describe('onStartTyping', () => {
  let element: HTMLInputElement
  let callBackFn: any

  beforeEach(() => {
    element = document.createElement('input')
    element.tabIndex = 1
    callBackFn = vi.fn()
  })

  function range(size: number, startAt = 0) {
    return [...Array.from({ length: size }).keys()].map(i => i + startAt)
  }

  it('triggers callback with any letter', async () => {
    const letters = range(26, 65)

    onStartTyping(callBackFn)

    for (let i = 0; i < letters.length; i++) {
      await userEvent.keyboard(String.fromCharCode(letters[i]))
    }

    expect(callBackFn).toBeCalledTimes(letters.length)
  })

  it('triggers callback with any number', async () => {
    const numbers = range(10, 48)
    const numpadNumbers = range(10, 96)

    onStartTyping(callBackFn)

    for (let i = 0; i < numbers.length; i++) {
      await userEvent.keyboard(String.fromCharCode(numbers[i]))
    }

    for (let i = 0; i < numpadNumbers.length; i++) {
      await userEvent.keyboard(String.fromCharCode(numpadNumbers[i]))
    }

    // todo: why -1?
    expect(callBackFn).toBeCalledTimes(numbers.length + numpadNumbers.length - 1)
  })

  it('does not trigger callback with invalid characters', async () => {
    document.body.appendChild(element)
    const arrows = range(4, 37)
    const functionKeys = range(32, 112)

    onStartTyping(callBackFn)

    for (let i = 0; i < arrows.length; i++) {
      await userEvent.fill(element, String.fromCharCode(arrows[i]))
    }

    for (let i = 0; i < functionKeys.length; i++) {
      await userEvent.fill(element, String.fromCharCode(functionKeys[i]) + String.fromCharCode(functionKeys[i]))
    }

    expect(callBackFn).toBeCalledTimes(0)
  })
})
