import { beforeEach, describe, expect, it } from 'vitest'
import { useFocusWithin } from './index'

describe('useFocusWithin', () => {
  let parent: HTMLFormElement
  let child: HTMLDivElement
  let child2: HTMLDivElement
  let grandchild: HTMLInputElement

  beforeEach(() => {
    parent = document.createElement('form')
    parent.tabIndex = 0
    document.body.appendChild(parent)

    child = document.createElement('div')
    child.tabIndex = 0
    parent.appendChild(child)

    child2 = document.createElement('div')
    child2.tabIndex = 0
    parent.appendChild(child2)

    grandchild = document.createElement('input')
    grandchild.tabIndex = 0
    child.appendChild(grandchild)
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

    child?.focus()
    expect(focused.value).toBeTruthy()

    child?.blur()
    expect(focused.value).toBeFalsy()

    grandchild?.focus()
    expect(focused.value).toBeTruthy()

    grandchild?.blur()
    expect(focused.value).toBeFalsy()
  })

  it('should track the state while the descendants switch focus state', () => {
    const { focused } = useFocusWithin(parent)

    expect(focused.value).toBeFalsy()

    child?.focus()
    expect(focused.value).toBeTruthy()

    child2?.focus()
    expect(focused.value).toBeTruthy()

    child?.focus()
    expect(focused.value).toBeTruthy()

    child?.blur()
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

    child.focus()
    expect(focused.value).toBeFalsy()
  })
})
