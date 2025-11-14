import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { computed, defineComponent, shallowRef, useTemplateRef } from 'vue'
import { useScroll } from '.'

const Component = defineComponent({
  template: `
    <div style='padding: 12px; display: flex; gap: 8px'>
      <button data-testId="left" @click="goToLeft">goToLeft</button>
      <button data-testId="right" @click="goToRight">goToRight</button>
      <button data-testId="top" @click="goToTop">goToTop</button>
      <button data-testId="bottom" @click="goToBottom">goToBottom</button>
      <button data-testId="toggleWidth" @click="toggleWidth">toggleWidth</button>
      <button data-testId="toggleHeight" @click="toggleHeight">toggleHeight</button>
      <button data-testId="toggleBox" @click="toggleBox">toggleBox</button>
    </div>
    <pre data-testId="arrivedState">{{ arrivedState }}</pre>
    <div
      ref="el"
      style="width: 300px; height: 300px; margin: auto; overflow: auto;"
    >
      <div v-if="showBox" :style></div>
    </div>
  `,
  props: ['observe'],
  setup(props) {
    const el = useTemplateRef<HTMLElement>('el')
    const { x, y, arrivedState } = useScroll(el, { observe: props.observe ?? false })
    function triggerScrollManually() {
      el.value?.dispatchEvent(new Event('scroll'))
    }
    function goToLeft() {
      x.value = 0
      triggerScrollManually()
    }
    function goToRight() {
      x.value = el.value?.scrollWidth || 300
      triggerScrollManually()
    }
    function goToTop() {
      y.value = 0
      triggerScrollManually()
    }
    function goToBottom() {
      y.value = el.value?.scrollHeight || 300
      triggerScrollManually()
    }
    const height = shallowRef(500)
    function toggleHeight() {
      if (height.value < 500)
        height.value = 500
      else
        height.value = 300
    }
    const width = shallowRef(500)
    function toggleWidth() {
      if (width.value < 500)
        width.value = 500
      else
        width.value = 300
    }
    const style = computed(() => `width: ${width.value}px; height: ${height.value}px; position: relative;`)
    const showBox = shallowRef(true)
    function toggleBox() {
      showBox.value = !showBox.value
    }
    return {
      el,
      style,
      arrivedState,
      showBox,
      goToLeft,
      goToRight,
      goToTop,
      goToBottom,
      toggleHeight,
      toggleWidth,
      toggleBox,
    }
  },
})

describe('useScroll', () => {
  it('should correctly detect leftArrived and rightArrived states when reaching the X-axis boundaries', async () => {
    const screen = page.render(Component, { props: { observe: true } })
    expect(screen).toBeDefined()
    const arrivedState = screen.getByTestId('arrivedState')
    await expect.element(arrivedState).toBeVisible()
    const rightButton = screen.getByTestId('right')
    await expect.element(rightButton).toBeVisible()
    await rightButton.click()
    expect(arrivedState.query()?.textContent).toMatchInlineSnapshot(`
      "{
        "left": false,
        "right": true,
        "top": true,
        "bottom": false
      }"
    `)
    const leftButton = screen.getByTestId('left')
    await expect.element(leftButton).toBeVisible()
    await leftButton.click()
    expect(arrivedState.query()?.textContent).toMatchInlineSnapshot(`
      "{
        "left": true,
        "right": false,
        "top": true,
        "bottom": false
      }"
    `)
  })

  it('should correctly detect topArrived and bottomArrived states when reaching the Y-axis boundaries', async () => {
    const screen = page.render(Component, { props: { observe: true } })
    expect(screen).toBeDefined()
    const arrivedState = screen.getByTestId('arrivedState')
    await expect.element(arrivedState).toBeVisible()
    const bottomButton = screen.getByTestId('bottom')
    await expect.element(bottomButton).toBeVisible()
    await bottomButton.click()
    expect(arrivedState.query()?.textContent).toMatchInlineSnapshot(`
      "{
        "left": true,
        "right": false,
        "top": false,
        "bottom": true
      }"
    `)
    const topButton = screen.getByTestId('top')
    await expect.element(topButton).toBeVisible()
    await topButton.click()
    expect(arrivedState.query()?.textContent).toMatchInlineSnapshot(`
      "{
        "left": true,
        "right": false,
        "top": true,
        "bottom": false
      }"
    `)
  })

  describe('observe DOM mutations when observe is enabled', () => {
    it('should detect boundary changes when child element size is modified', async () => {
      const screen = page.render(Component, { props: { observe: true } })
      expect(screen).toBeDefined()
      const arrivedState = screen.getByTestId('arrivedState')
      await expect.element(arrivedState).toBeVisible()
      const toggleHeightButton = screen.getByTestId('toggleHeight')
      const toggleWidthButton = screen.getByTestId('toggleWidth')
      await expect.element(toggleHeightButton).toBeVisible()
      await expect.element(toggleWidthButton).toBeVisible()
      await toggleHeightButton.click()
      await toggleWidthButton.click()
      expect(arrivedState.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "left": true,
          "right": true,
          "top": true,
          "bottom": true
        }"
      `)
      await toggleHeightButton.click()
      await toggleWidthButton.click()
      expect(arrivedState.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "left": true,
          "right": false,
          "top": true,
          "bottom": false
        }"
      `)
    })

    it('should detect boundary changes when child element is added or removed', async () => {
      const screen = page.render(Component, { props: { observe: true } })
      expect(screen).toBeDefined()
      const arrivedState = screen.getByTestId('arrivedState')
      await expect.element(arrivedState).toBeVisible()
      const toggleBoxButton = screen.getByTestId('toggleBox')
      await expect.element(toggleBoxButton).toBeVisible()
      await toggleBoxButton.click()
      expect(arrivedState.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "left": true,
          "right": true,
          "top": true,
          "bottom": true
        }"
      `)
      await toggleBoxButton.click()
      expect(arrivedState.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "left": true,
          "right": false,
          "top": true,
          "bottom": false
        }"
      `)
    })
  })
})
