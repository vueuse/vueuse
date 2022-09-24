import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { useFocusWithin } from '.'

describe('useFocusWithin', () => {
  let parent: Ref<HTMLFormElement>
  let child: Ref<HTMLDivElement>
  let grandchild: Ref<HTMLInputElement>

  beforeEach(() => {
    parent = ref(document.createElement('form'))
    parent.value.tabIndex = 0
    document.body.appendChild(parent.value)

    child = ref(document.createElement('div'))
    child.value.tabIndex = 0
    parent.value.appendChild(child.value)

    grandchild = ref(document.createElement('input'))
    grandchild.value.tabIndex = 0
    child.value.appendChild(grandchild.value)
  })

  it('should be defined', () => {
    expect(useFocusWithin).toBeDefined()
  })

  it('should initialize properly', () => {
    const { focused } = useFocusWithin(parent)

    expect(focused.value).toBeFalsy()
  })

  it('should track the state of the target itself', () => {
    const { focused } = useFocusWithin(parent)

    expect(focused.value).toBeFalsy()

    parent.value?.focus()
    expect(focused.value).toBeTruthy()

    parent.value?.blur()
    expect(focused.value).toBeFalsy()
  })

  it('should track the state of the targets descendants', () => {
    const { focused } = useFocusWithin(parent)

    expect(focused.value).toBeFalsy()

    child.value?.focus()
    expect(focused.value).toBeTruthy()

    child.value?.blur()
    expect(focused.value).toBeFalsy()

    grandchild.value?.focus()
    expect(focused.value).toBeTruthy()

    grandchild.value?.blur()
    expect(focused.value).toBeFalsy()
  })

  it('should the state of target always be falsy when document.activeElement invalid', () => {
    const mockWindow = new Proxy(window, {
      get: (target, prop: any) => {
        if (prop === 'document')
          return { ...document, activeElement: null }

        return window[prop]
      },
    })
    const { focused } = useFocusWithin(parent, { window: mockWindow })

    expect(focused.value).toBeFalsy()

    parent.value.focus()
    expect(focused.value).toBeFalsy()

    child.value.focus()
    expect(focused.value).toBeFalsy()
  })
})
