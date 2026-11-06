import { nextTick, shallowRef } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { useTextDirection } from './index'

describe('useTextDirection', () => {
  const htmlEl = document.documentElement
  const bodyEl = document.body

  afterEach(() => {
    htmlEl.removeAttribute('dir')
    document.body.removeAttribute('dir')
  })

  it('should be defined', () => {
    expect(useTextDirection).toBeDefined()
  })

  it('should have default value of ltr', () => {
    const dir = useTextDirection()
    expect(dir.value).toBe('ltr')
    expect(htmlEl.attributes).toMatchInlineSnapshot(`NamedNodeMap {}`)
  })

  it('should take initialValue as default if passed', () => {
    const dir = useTextDirection({ initialValue: 'rtl' })
    expect(dir.value).toBe('rtl')
    expect(htmlEl.attributes).toMatchInlineSnapshot(`NamedNodeMap {}`)
  })

  it('should set rtl dir to html tag', () => {
    const dir = useTextDirection()
    expect(htmlEl.attributes).toMatchInlineSnapshot(`NamedNodeMap {}`)
    dir.value = 'rtl'
    expect(htmlEl.attributes).toMatchInlineSnapshot(`
      NamedNodeMap {
        "dir": "rtl",
      }
    `)
  })

  it('should be able to customize selector', () => {
    const dir = useTextDirection({ selector: 'body' })
    dir.value = 'rtl'
    expect(htmlEl.attributes).toMatchInlineSnapshot(`NamedNodeMap {}`)
    expect(bodyEl.attributes).toMatchInlineSnapshot(`
      NamedNodeMap {
        "dir": "rtl",
      }
    `)
  })

  it('should observe changes on htmlEl', () => {
    useTextDirection({ observe: true })
    expect(htmlEl.attributes).toMatchInlineSnapshot(`NamedNodeMap {}`)
    htmlEl.setAttribute('dir', 'rtl')
    expect(htmlEl.attributes).toMatchInlineSnapshot(`
      NamedNodeMap {
        "dir": "rtl",
      }
    `)
  })

  it('should observe changes on custom selector', () => {
    useTextDirection({ observe: true, selector: 'body' })
    expect(bodyEl.attributes).toMatchInlineSnapshot(`NamedNodeMap {}`)
    expect(htmlEl.attributes).toMatchInlineSnapshot(`NamedNodeMap {}`)
    bodyEl.setAttribute('dir', 'rtl')
    expect(bodyEl.attributes).toMatchInlineSnapshot(`
      NamedNodeMap {
        "dir": "rtl",
      }
    `)
    expect(htmlEl.attributes).toMatchInlineSnapshot(`NamedNodeMap {}`)
  })

  it('should read the computed direction from an element target', () => {
    const element = document.createElement('div')
    element.style.direction = 'rtl'

    const dir = useTextDirection(element)

    expect(dir.value).toBe('rtl')
  })

  it('should track a reactive element target', async () => {
    const firstElement = document.createElement('div')
    firstElement.style.direction = 'rtl'
    const target = shallowRef<HTMLElement | null>(firstElement)
    const dir = useTextDirection(target)

    expect(dir.value).toBe('rtl')

    const nextElement = document.createElement('div')
    nextElement.style.direction = 'ltr'
    target.value = nextElement
    await nextTick()

    expect(dir.value).toBe('ltr')
  })

  it('should set the dir attribute on an element target', () => {
    const element = document.createElement('div')
    const dir = useTextDirection(element)

    dir.value = 'rtl'

    expect(element.getAttribute('dir')).toBe('rtl')
    expect(dir.value).toBe('rtl')
  })

  it('should observe an element target when requested', async () => {
    const element = document.createElement('div')
    const dir = useTextDirection(element, { observe: true })

    await nextTick()
    element.setAttribute('dir', 'rtl')
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(dir.value).toBe('rtl')
  })

})
