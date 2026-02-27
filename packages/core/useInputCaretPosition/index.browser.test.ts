import { page, userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useInputCaretPosition } from '.'

const simpleInput = defineComponent({
  template: `<input data-testId="input" value="vueuse is cool!">`,
})

describe('useInputCaretPosition', () => {
  it('should be defined', () => {
    expect(useInputCaretPosition).toBeDefined()
  })

  it('should return the initial position', async () => {
    const wrapper = mount(simpleInput)
    const { position } = useInputCaretPosition(wrapper.element)
    expect(position.value).toMatchInlineSnapshot(`15`)
  })

  it('should update the position selection change', async ({ onTestFailed, onTestFinished }) => {
    const screen = page.render(simpleInput)
    onTestFailed(() => screen.unmount())
    onTestFinished(() => screen.unmount())
    const input = screen.getByTestId('input')
    const element = input.element() as HTMLInputElement
    const { position } = useInputCaretPosition(element)

    await userEvent.click(input)
    expect(position.value).toMatchInlineSnapshot(`15`)
    await userEvent.keyboard('[ArrowLeft][ArrowLeft]')
    expect(position.value).toMatchInlineSnapshot(`13`)
  })

  it('should update the element when updating the refs', async ({ onTestFailed, onTestFinished }) => {
    const screen = page.render(simpleInput)
    onTestFailed(() => screen.unmount())
    onTestFinished(() => screen.unmount())
    const input = screen.getByTestId('input')
    const element = input.element() as HTMLInputElement

    const { position } = useInputCaretPosition(element)

    expect(element.selectionStart).toMatchInlineSnapshot(`15`)
    expect(element.selectionEnd).toMatchInlineSnapshot(`15`)

    position.value = 2

    await nextTick()
    expect(element.selectionStart).toMatchInlineSnapshot(`2`)
    expect(element.selectionEnd).toMatchInlineSnapshot(`2`)
  })
})
