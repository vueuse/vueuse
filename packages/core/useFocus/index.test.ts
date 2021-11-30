import { Ref, ref, nextTick } from 'vue-demi'
import { useFocus } from '.'

describe('useFocus', () => {
  let target: Ref<HTMLButtonElement | null>

  beforeEach(() => {
    // to silent 'focus not implemented' message coming from JSDOM
    Object.defineProperty(window, 'focus', { value() {} })

    target = ref(document.createElement('button'));
    (target.value as HTMLButtonElement).tabIndex = 0
    document.body.appendChild(target.value as HTMLButtonElement)
  })

  it('should be defined', () => {
    expect(useFocus).toBeDefined()
  })

  it('should initialize properly', () => {
    const { focused } = useFocus({ target })

    expect(focused.value).toBeFalsy()
  })

  it('reflect focus state in reactive ref value', () => {
    const { focused } = useFocus({ target })

    expect(focused.value).toBeFalsy()

    target.value?.focus()
    expect(focused.value).toBeTruthy()

    target.value?.blur()
    expect(focused.value).toBeFalsy()
  })

  it('reflect reactive ref `focused` state changes in DOM', async() => {
    const { focused } = useFocus({ target })

    expect(focused.value).toBeFalsy()

    focused.value = true
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(target.value)

    focused.value = false
    await nextTick()
    await nextTick()
    expect(document.activeElement).not.toBe(target.value)
  })

  describe('when target is null', () => {
    it('should initialize properly', () => {
      target.value = null
      const { focused } = useFocus({ target })

      expect(focused.value).toBeFalsy()
    })
  })

  describe('when initialValue=true passed in', () => {
    it('should initialize focus', async() => {
      const { focused } = useFocus({ target, initialValue: true })

      await nextTick()

      expect(document.activeElement).toBe(target.value)
      expect(focused.value).toBeTruthy()
    })
  })
})
