import { describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { defineComponent, onMounted, useTemplateRef } from 'vue'
import { unrefElement } from './index'

describe('unrefElement', () => {
  it('return the input if it is not an element ref nor a Vue instance', () => {
    expect(unrefElement(null)).toBeNull()
    expect(unrefElement(undefined)).toBeUndefined()
  })

  it('return the element if it is an element ref', async () => {
    let unrefElementReturn: HTMLElement | null | undefined

    const Component = defineComponent({
      template: `
        <div ref="target-node" id="target-node">Target Node</div>
      `,
      setup() {
        const targetNodeRef = useTemplateRef<HTMLElement>('target-node')
        onMounted(() => {
          unrefElementReturn = unrefElement(targetNodeRef)
        })
      },
    })

    page.render(Component)

    await vi.waitFor(() => {
      expect(unrefElementReturn).toBeInstanceOf(HTMLDivElement)
      expect(unrefElementReturn?.id).toBe('target-node')
    })
  })

  it('return the root element if it is a Vue instance', async () => {
    let unrefElementReturn: HTMLElement | null | undefined

    const ChildComponent = defineComponent({
      template: `
        <div id="child-root-node">Child Root Node</div>
      `,
    })

    const Component = defineComponent({
      template: `
        <div>
          <ChildComponent ref="target-node" />
        </div>
      `,
      components: {
        ChildComponent,
      },
      setup() {
        const targetNodeRef = useTemplateRef<HTMLElement>('target-node')
        onMounted(() => {
          unrefElementReturn = unrefElement(targetNodeRef)
        })
      },
    })

    page.render(Component)

    await vi.waitFor(() => {
      expect(unrefElementReturn).toBeInstanceOf(HTMLDivElement)
      expect(unrefElementReturn?.id).toBe('child-root-node')
    })
  })

  it('return the text node if it is a Vue instance with only text', async () => {
    let unrefElementReturn: HTMLElement | null | undefined

    const ChildComponent = defineComponent({
      template: 'This is a text node',
    })

    const Component = defineComponent({
      template: `
        <div>
          <ChildComponent ref="target-node" />
        </div>
      `,
      components: {
        ChildComponent,
      },
      setup() {
        const targetNodeRef = useTemplateRef<HTMLElement>('target-node')
        onMounted(() => {
          unrefElementReturn = unrefElement(targetNodeRef)
        })
      },
    })

    page.render(Component)

    await vi.waitFor(() => {
      expect(unrefElementReturn?.nodeType).toBe(Node.TEXT_NODE)
      expect(unrefElementReturn?.textContent).toBe('This is a text node')
    })
  })

  it('return a placeholder DOM node (an empty text node) if it is a Vue instance empty text node if it is a Vue instance with multiple root elements', async () => {
    let unrefElementReturn: HTMLElement | null | undefined

    const ChildComponent = defineComponent({
      template: `
        <div id="child-root-node">Child Root Node</div>
        <div id="child-root-node-2">Child Root Node 2</div
      `,
    })

    const Component = defineComponent({
      template: `
        <div>
          <ChildComponent ref="target-node" />
        </div>
      `,
      components: {
        ChildComponent,
      },
      setup() {
        const targetNodeRef = useTemplateRef<HTMLElement>('target-node')
        onMounted(() => {
          unrefElementReturn = unrefElement(targetNodeRef)
        })
      },
    })

    page.render(Component)

    await vi.waitFor(() => {
      expect(unrefElementReturn).toBeInstanceOf(Text)
      expect(unrefElementReturn?.id).toBeUndefined()
      expect(unrefElementReturn?.textContent).toBe('')
    })
  })
})
