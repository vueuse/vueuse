import { afterEach, describe, expect, it } from 'vitest'
import { useTextDirection } from '.'

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
})
