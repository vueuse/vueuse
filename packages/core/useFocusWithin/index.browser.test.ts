import { beforeEach, describe, expect, it } from 'vitest'
import { useFocusWithin } from './index'

describe('useFocusWithin', () => {
  let parent: HTMLFormElement
  let child: HTMLDivElement
  let grandchild: HTMLInputElement
  let outsider: HTMLButtonElement

  beforeEach(() => {
    document.body.innerHTML = ''

    parent = document.createElement('form')
    parent.tabIndex = 0
    document.body.appendChild(parent)

    child = document.createElement('div')
    child.tabIndex = 0
    parent.appendChild(child)

    grandchild = document.createElement('input')
    grandchild.tabIndex = 0
    child.appendChild(grandchild)

    // A sibling of `parent`, i.e. not contained within the target.
    outsider = document.createElement('button')
    outsider.tabIndex = 0
    document.body.appendChild(outsider)
  })

  it('should track focus of descendants', () => {
    const { focused } = useFocusWithin(parent)

    expect(focused.value).toBeFalsy()

    grandchild.focus()
    expect(focused.value).toBeTruthy()

    grandchild.blur()
    expect(focused.value).toBeFalsy()
  })

  it('should be false when an unrelated element outside the target is focused', () => {
    const { focused } = useFocusWithin(parent)

    expect(focused.value).toBeFalsy()

    // Focusing an element that is not the target nor a descendant.
    outsider.focus()
    expect(focused.value).toBeFalsy()

    grandchild.focus()
    expect(focused.value).toBeTruthy()

    outsider.focus()
    expect(focused.value).toBeFalsy()
  })

  it('should reset the state when the focused descendant is removed', async () => {
    const { focused } = useFocusWithin(parent)

    grandchild.focus()
    expect(focused.value).toBeTruthy()

    // Removing the focused element does not reliably fire `focusout`; the
    // MutationObserver on the subtree is what re-syncs the state here.
    grandchild.remove()

    await expect.poll(() => focused.value).toBeFalsy()
  })

  it('should reset the state when a focused deep descendant is removed with its ancestor', async () => {
    const { focused } = useFocusWithin(parent)

    grandchild.focus()
    expect(focused.value).toBeTruthy()

    // Remove the intermediate ancestor; the focused `grandchild` goes with it.
    child.remove()

    await expect.poll(() => focused.value).toBeFalsy()
  })
})
