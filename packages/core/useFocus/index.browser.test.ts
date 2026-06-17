import { beforeEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { useFocus } from './index'

describe('useFocus', () => {
  let target: HTMLButtonElement

  beforeEach(() => {
    document.body.innerHTML = ''
    target = document.createElement('button')
    target.tabIndex = 0
    document.body.appendChild(target)
  })

  it('should be defined', () => {
    expect(useFocus).toBeDefined()
  })

  it('should initialize properly', () => {
    const { focused } = useFocus(target)

    expect(focused.value).toBeFalsy()
  })

  it('reflect focus state in reactive ref value', () => {
    const { focused } = useFocus(target)

    expect(focused.value).toBeFalsy()

    target?.focus()
    expect(focused.value).toBeTruthy()

    target?.blur()
    expect(focused.value).toBeFalsy()
  })

  it('reflect reactive ref `focused` state changes in DOM', async () => {
    const { focused } = useFocus(target)

    expect(focused.value).toBeFalsy()

    focused.value = true
    expect(document.activeElement).toBe(target)

    focused.value = false
    expect(document.activeElement).not.toBe(target)
  })

  it('should only focus when :focus-visible matches with focusVisible=true', async () => {
    const { focused } = useFocus(target, { focusVisible: true })

    await userEvent.tab()
    expect(focused.value).toBeTruthy()

    await userEvent.tab()
    expect(focused.value).toBeFalsy()

    target = document.createElement('button')
    target.tabIndex = 0
    document.body.appendChild(target)

    await userEvent.tab()
    await userEvent.tab()

    expect(focused.value).toBeFalsy()
  })

  describe('when target is missing', () => {
    it('should initialize properly', () => {
      const { focused } = useFocus(null)

      expect(focused.value).toBeFalsy()
    })
  })

  describe('when initialValue=true passed in', () => {
    it('should initialize focus', async () => {
      const { focused } = useFocus(target, { initialValue: true })

      expect(document.activeElement).toBe(target)
      expect(focused.value).toBeTruthy()
    })
  })
})
