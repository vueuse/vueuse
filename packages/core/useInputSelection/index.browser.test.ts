import { page, userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useInputSelection } from '.'

const simpleInput = defineComponent({
  template: `<input data-testId="input" value="vueuse is cool!">`,
})

// TODO: this tests current chrome behavior, initial values are not consistent across browsers
describe('useInputSelection', () => {
  it('should be defined', () => {
    expect(useInputSelection).toBeDefined()
  })

  it('should return the initial position', async () => {
    const wrapper = mount(simpleInput)
    const { start, end, direction } = useInputSelection(wrapper.element)
    expect(start.value).toMatchInlineSnapshot(`15`)
    expect(end.value).toMatchInlineSnapshot(`15`)
    expect(direction.value).toMatchInlineSnapshot(`"forward"`)
  })

  it('should update the position selection change', async ({ onTestFailed, onTestFinished }) => {
    const screen = page.render(simpleInput)
    onTestFailed(() => screen.unmount())
    onTestFinished(() => screen.unmount())
    const input = screen.getByTestId('input')
    const element = input.element() as HTMLInputElement
    const { start, end, direction } = useInputSelection(element)

    // simulating select all
    await userEvent.tripleClick(input)
    expect(element.selectionStart).toMatchInlineSnapshot(`0`)
    expect(element.selectionEnd).toMatchInlineSnapshot(`15`)
    expect(start.value).toMatchInlineSnapshot(`0`)
    expect(end.value).toMatchInlineSnapshot(`15`)
    expect(direction.value).toMatchInlineSnapshot(`"forward"`)
  })

  it('should update the element when updating the refs', async ({ onTestFailed, onTestFinished }) => {
    const screen = page.render(simpleInput)
    onTestFailed(() => screen.unmount())
    onTestFinished(() => screen.unmount())
    const input = screen.getByTestId('input')
    const element = input.element() as HTMLInputElement
    const { start, end, direction } = useInputSelection(element)

    start.value = 1
    end.value = 2
    direction.value = 'backward'
    await nextTick()
    expect(element.selectionStart).toMatchInlineSnapshot(`1`)
    expect(element.selectionEnd).toMatchInlineSnapshot(`2`)
    expect(element.selectionDirection).toMatchInlineSnapshot(`"backward"`)
  })
})
