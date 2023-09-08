import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { beforeEach, describe, expect, it } from 'vitest'
import { retry } from '../../.test'
import { useFocus } from '.'

describe('useFocus', () => {
  let target: Ref<HTMLButtonElement>

  beforeEach(() => {
    target = ref(document.createElement('button'))
    target.value.tabIndex = 0
    document.body.appendChild(target.value)
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

    target.value?.focus()
    expect(focused.value).toBeTruthy()

    target.value?.blur()
    expect(focused.value).toBeFalsy()
  })

  it('reflect reactive ref `focused` state changes in DOM', async () => {
    const { focused } = useFocus(target)

    expect(focused.value).toBeFalsy()

    focused.value = true

    await retry(() => expect(document.activeElement).toBe(target.value))

    focused.value = false
    await retry(() => expect(document.activeElement).not.toBe(target.value))
  })

  it('should only focus when :focus-visible matches with focusVisible=true', () => {
    const { focused } = useFocus(target, { focusVisible: true })

    let event = new Event('focus')
    Object.defineProperty(event, 'target', { value: { matches: () => true }, enumerable: true })
    target.value?.dispatchEvent(event)
    expect(focused.value).toBeTruthy()

    target.value?.dispatchEvent(new Event('blur'))
    expect(focused.value).toBeFalsy()

    event = new Event('focus')
    Object.defineProperty(event, 'target', { value: { matches: () => false }, enumerable: true })
    target.value?.dispatchEvent(event)
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

      await retry(() => {
        expect(document.activeElement).toBe(target.value)
        expect(focused.value).toBeTruthy()
      })
    })
  })
})
