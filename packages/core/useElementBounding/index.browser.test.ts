import { page } from '@vitest/browser/context'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, shallowRef } from 'vue'
import { useElementBounding } from '.'

const Component = defineComponent({
  template:
  `<div style="overflow: auto">
    <div style="heigth: 300vh">
      <div ref="el" :style v-if="hasElement"/>
      <pre data-testId="data">{{bounding}}</pre>
      <button data-testId="width" @click="handleWidth">b</button>
      <button data-testId="margin" @click="handleMargin">m</button>
      <button data-testId="remove" @click="handleRemove">r</button>
      <button data-testId="update" @click="()=>bounding.update()">manual</button>
    </div>
  </div>`,
  props: ['margin', 'padding', 'options'],
  setup(props) {
    const el = shallowRef()
    const bounding = useElementBounding(el, props.options)
    const hasElement = shallowRef(true)
    const width = shallowRef(props.margin ?? '200px')
    const margin = shallowRef('0')
    const style = computed(() => {
      return `width: ${width.value};height:50px;margin:${margin.value};padding:${props.padding ?? 0}`
    })
    const handleWidth = () => {
      width.value = '34px'
    }
    const handleMargin = () => {
      margin.value = '69px'
    }
    const handleRemove = () => {
      hasElement.value = false
    }

    return { el, bounding, style, handleWidth, handleMargin, hasElement, handleRemove }
  },
})

describe('useElementBounding', () => {
  it('should return width and height of element', async () => {
    const screen = page.render(Component)
    const pre = screen.getByTestId('data')
    await expect.element(pre).toBeVisible()
    expect(pre.query()?.textContent).toMatchInlineSnapshot(`
      "{
        "height": 50,
        "bottom": 50,
        "left": 0,
        "right": 200,
        "top": 0,
        "width": 200,
        "x": 0,
        "y": 0
      }"
    `)
  })

  it('should have reactive values', async () => {
    const screen = page.render(Component)
    const pre = screen.getByTestId('data')
    const widthButton = screen.getByTestId('width')
    const marginButton = screen.getByTestId('margin')
    await expect.element(widthButton).toBeVisible()
    await expect.element(marginButton).toBeVisible()
    await widthButton.click()
    await marginButton.click()
    await expect.element(pre).toBeVisible()
    expect(pre.query()?.textContent).toMatchInlineSnapshot(`
      "{
        "height": 50,
        "bottom": 119,
        "left": 69,
        "right": 103,
        "top": 69,
        "width": 34,
        "x": 69,
        "y": 69
      }"
    `)
  })

  it('should respect padding and margin', async () => {
    const screen = page.render(Component, { props: { margin: '400px', padding: '123px' } })
    const pre = screen.getByTestId('data')
    await expect.element(pre).toBeVisible()
    expect(pre.query()?.textContent).toMatchInlineSnapshot(`
      "{
        "height": 296,
        "bottom": 296,
        "left": 0,
        "right": 646,
        "top": 0,
        "width": 646,
        "x": 0,
        "y": 0
      }"
    `)
  })

  it('should reset values to 0 if el is unmounted', async () => {
    const screen = page.render(Component)
    const pre = screen.getByTestId('data')
    const button = screen.getByTestId('remove')
    await expect.element(pre).toBeVisible()
    await expect.element(button).toBeVisible()
    await button.click()
    expect(pre.query()?.textContent).toMatchInlineSnapshot(`
      "{
        "height": 0,
        "bottom": 0,
        "left": 0,
        "right": 0,
        "top": 0,
        "width": 0,
        "x": 0,
        "y": 0
      }"
    `)
  })

  it('should not reset values to 0 if el is unmounted with options.reset set to false', async () => {
    const screen = page.render(Component, { props: { options: { reset: false } } })
    const pre = screen.getByTestId('data')
    const button = screen.getByTestId('remove')
    await expect.element(pre).toBeVisible()
    await expect.element(button).toBeVisible()
    const content = pre.query()?.textContent
    await button.click()
    expect(pre.query()?.textContent).toBe(content)
  })

  it('should not update immediate with options.immediate set to false', async () => {
    const screen = page.render(Component, { props: { options: { immediate: false } } })
    const pre = screen.getByTestId('data')
    const updateButton = screen.getByTestId('update')
    await expect.element(pre).toBeVisible()
    await expect.element(updateButton).toBeVisible()
    const contentBefore = pre.query()?.textContent
    expect(contentBefore).toMatchInlineSnapshot(`
      "{
        "height": 0,
        "bottom": 0,
        "left": 0,
        "right": 0,
        "top": 0,
        "width": 0,
        "x": 0,
        "y": 0
      }"
    `)
    await updateButton.click()
    const contentAfterFirstUpdate = pre.query()?.textContent
    expect(contentAfterFirstUpdate).not.toBe(contentBefore)
    expect(contentAfterFirstUpdate).toMatchInlineSnapshot(`
      "{
        "height": 50,
        "bottom": 50,
        "left": 0,
        "right": 200,
        "top": 0,
        "width": 200,
        "x": 0,
        "y": 0
      }"
    `)
  })

  it.todo('should update when scolling')
  it.todo('should not update when scolling with options.windowScroll set to false')
})
