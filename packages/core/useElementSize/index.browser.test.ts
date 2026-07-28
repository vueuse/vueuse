import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { computed, defineComponent, shallowRef } from 'vue'
import { useElementSize } from './index'

const DOMComponent = defineComponent({
  template:
  `<div style="overflow: auto">
    <div style="heigth: 300vh">
      <div ref="el" :style v-if="hasElement"/>
      <pre data-testId="data">{{size}}</pre>
      <button data-testId="width" @click="handleWidth">b</button>
      <button data-testId="margin" @click="handleMargin">m</button>
      <button data-testId="remove" @click="handleRemove">r</button>
      <button data-testId="scale" @click="handleScale">s</button>
    </div>
  </div>`,
  props: ['margin', 'padding', 'options'],
  setup(props) {
    const el = shallowRef()
    const size = useElementSize(el, props.options)
    const hasElement = shallowRef(true)
    const width = shallowRef(props.margin ?? '200px')
    const margin = shallowRef('0')
    const scale = shallowRef('1')
    const style = computed(() => {
      return `width: ${width.value};height:50px;margin:${margin.value};padding:${props.padding ?? 0};transform: scale(${scale.value});`
    })
    const handleWidth = () => {
      width.value = '34px'
    }
    const handleMargin = () => {
      margin.value = '69px'
    }
    const handleScale = () => {
      scale.value = '1.5'
    }
    const handleRemove = () => {
      hasElement.value = false
    }

    return { el, size, style, handleWidth, handleMargin, hasElement, handleRemove, handleScale }
  },
})
const SVGComponent = defineComponent({
  template:
  `<div style="overflow: auto">
    <div style="heigth: 300vh">
      <div v-if="hasElement" :style="containerStyle">
        <svg ref="el" width="100%" height="100%" :style="style"/>
      </div>
      <pre data-testId="data">{{size}}</pre>
      <button data-testId="width" @click="handleWidth">b</button>
      <button data-testId="margin" @click="handleMargin">m</button>
      <button data-testId="remove" @click="handleRemove">r</button>
      <button data-testId="scale" @click="handleScale">s</button>
    </div>
  </div>`,
  props: ['margin', 'padding', 'options'],
  setup(props) {
    const el = shallowRef()
    const size = useElementSize(el, props.options)
    const hasElement = shallowRef(true)
    const width = shallowRef(props.margin ?? '200px')
    const margin = shallowRef('0')
    const scale = shallowRef('1')
    const style = computed(() => {
      return `margin:${margin.value};padding:${props.padding ?? 0};transform: scale(${scale.value});`
    })
    const containerStyle = computed(() => {
      return `width:${width.value};height:50px;transform:scale(${scale.value});`
    })
    const handleWidth = () => {
      width.value = '34px'
    }
    const handleMargin = () => {
      margin.value = '69px'
    }
    const handleScale = () => {
      scale.value = '1.5'
    }
    const handleRemove = () => {
      hasElement.value = false
    }

    return { el, size, containerStyle, style, handleWidth, handleMargin, hasElement, handleRemove, handleScale }
  },
})

describe('useElementSize', () => {
  describe('dOM Element', () => {
    it('should return width and height of DOM element', async () => {
      const screen = page.render(DOMComponent)
      const pre = screen.getByTestId('data')
      await expect.element(pre).toBeVisible()
      expect(pre.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "width": 200,
          "height": 50
        }"
      `)
    })

    it('should have reactive values', async () => {
      const screen = page.render(DOMComponent)
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
          "width": 34,
          "height": 50
        }"
    `)
    })

    it('should respect padding and margin', async () => {
      const screen = page.render(DOMComponent, { props: { margin: '400px', padding: '123px' } })
      const pre = screen.getByTestId('data')
      await expect.element(pre).toBeVisible()
      expect(pre.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "width": 646,
          "height": 296
        }"
      `)
    })

    it('should reset values to 0 if el is unmounted', async () => {
      const screen = page.render(DOMComponent)
      const pre = screen.getByTestId('data')
      const button = screen.getByTestId('remove')
      await expect.element(pre).toBeVisible()
      await expect.element(button).toBeVisible()
      await button.click()
      expect(pre.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "width": 0,
          "height": 0
        }"
      `)
    })

    it.todo('should respect border-box option')

    it.todo('should respect content-box option')

    it('should work with scale transform', async () => {
      const screen = page.render(DOMComponent)
      const pre = screen.getByTestId('data')
      const scaleButton = screen.getByTestId('scale')

      await expect.element(scaleButton).toBeVisible()
      await scaleButton.click()

      await expect.element(pre).toBeVisible()
      expect(pre.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "width": 200,
          "height": 50
        }"
      `)
    })
  })

  describe('sVG Element', () => {
    it('should return width and height of SVG element', async () => {
      const screen = page.render(SVGComponent)
      const pre = screen.getByTestId('data')
      await expect.element(pre).toBeVisible()
      expect(pre.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "width": 200,
          "height": 50
        }"
      `)
    })

    it('should have reactive values', async () => {
      const screen = page.render(SVGComponent)
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
          "width": 34,
          "height": 50
        }"
    `)
    })

    it('should respect padding and margin', async () => {
      const screen = page.render(SVGComponent, { props: { margin: '400px', padding: '123px' } })
      const pre = screen.getByTestId('data')
      await expect.element(pre).toBeVisible()
      expect(pre.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "width": 646,
          "height": 296
        }"
      `)
    })

    it('should reset values to 0 if el is unmounted', async () => {
      const screen = page.render(SVGComponent)
      const pre = screen.getByTestId('data')
      const button = screen.getByTestId('remove')
      await expect.element(pre).toBeVisible()
      await expect.element(button).toBeVisible()
      await button.click()
      expect(pre.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "width": 0,
          "height": 0
        }"
      `)
    })

    it.todo('should respect border-box option')

    it.todo('should respect content-box option')

    it('should work with scale transform', async () => {
      const screen = page.render(SVGComponent)
      const pre = screen.getByTestId('data')
      const scaleButton = screen.getByTestId('scale')

      await expect.element(scaleButton).toBeVisible()
      await scaleButton.click()

      await expect.element(pre).toBeVisible()
      expect(pre.query()?.textContent).toMatchInlineSnapshot(`
        "{
          "width": 200,
          "height": 50
        }"
      `)
    })
  })
})
