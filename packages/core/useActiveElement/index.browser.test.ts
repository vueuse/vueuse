import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { nextTick } from 'vue'
import { useActiveElement } from './index'

describe('useActiveElement', () => {
  let shadowHost: HTMLElement
  let input: HTMLInputElement
  let shadowInput: HTMLInputElement
  let shadowRoot: ShadowRoot

  beforeEach(() => {
    shadowHost = document.createElement('div')
    shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    input = document.createElement('input')
    shadowInput = input.cloneNode() as HTMLInputElement
    shadowRoot.appendChild(shadowInput)
    document.body.appendChild(input)
    document.body.appendChild(shadowHost)
  })

  afterEach(() => {
    shadowHost.remove()
    input.remove()
  })

  it('should be defined', () => {
    expect(useActiveElement).toBeDefined()
  })

  it('should initialise correctly', () => {
    const activeElement = useActiveElement()

    expect(activeElement.value).to.equal(document.body)
  })

  it('should initialise with already-active element', async () => {
    await userEvent.fill(input, 'focus')

    const activeElement = useActiveElement()

    expect(activeElement.value).to.equal(input)
  })

  it('should accept custom document', async () => {
    const activeElement = useActiveElement({ document: shadowRoot })

    await userEvent.fill(shadowInput, 'focus')

    expect(activeElement.value).to.equal(shadowInput)
  })

  it('should observe focus/blur events', async () => {
    const activeElement = useActiveElement()

    await userEvent.fill(input, 'focus')

    expect(activeElement.value).to.equal(input)

    await userEvent.click(document.body)

    expect(activeElement.value).to.equal(document.body)
  })

  it('should update when activeElement is removed w/document', async () => {
    const activeElement = useActiveElement({ triggerOnRemoval: true })

    await userEvent.fill(input, 'focus')

    expect(activeElement.value).to.equal(input)

    input.remove()

    await nextTick()

    expect(activeElement.value).to.equal(document.body)
  })

  it('should update when activeElement is removed w/shadowRoot', async () => {
    const activeElement = useActiveElement({ triggerOnRemoval: true, document: shadowRoot })

    await userEvent.fill(shadowInput, 'focus')

    expect(activeElement.value).to.equal(shadowInput)

    shadowInput.remove()

    await nextTick()

    expect(activeElement.value).to.equal(null)
  })
})
