import { page } from '@vitest/browser/context'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup } from 'vitest-browser-vue'
import { computed, defineComponent, onMounted, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  const createNodeWithId = (id: string) => {
    const node = document.createElement('div')
    node.id = id
    document.body.appendChild(node)
    return node
  }

  describe('send IntersectionObserver messages', () => {
    const callbackMock = () => {}
    const observeMock = vi.fn()
    const disconnectMock = vi.fn()
    const IntersectionObserverMock = vi.fn(() => ({
      disconnect: disconnectMock,
      observe: observeMock,
    }))

    beforeAll(() => {
      vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
    })

    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterAll(() => {
      vi.unstubAllGlobals()
    })

    it('pass IntersectionObserver correct parameters', async () => {
      const targetNode = createNodeWithId('target-node')

      useIntersectionObserver(
        targetNode,
        callbackMock,
      )

      await vi.waitFor(() => {
        expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
        expect(IntersectionObserverMock).toHaveBeenCalledWith(
          callbackMock,
          {
            root: undefined,
            rootMargin: '0px',
            threshold: 0,
          },
        )

        expect(observeMock).toHaveBeenCalledTimes(1)
        expect(observeMock.mock.calls[0][0]).toBe(targetNode)

        targetNode.remove()
      })
    })

    it('provided options will be passed to IntersectionObserver', async () => {
      const targetNode = createNodeWithId('target-node')
      const rootNode = createNodeWithId('root-node')
      document.body.appendChild(rootNode)

      useIntersectionObserver(
        targetNode,
        callbackMock,
        {
          root: rootNode,
          rootMargin: '10px 20px 30px 40px',
          threshold: [0, 0.5, 1],
        },
      )

      await vi.waitFor(() => {
        expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
        expect(IntersectionObserverMock).toHaveBeenCalledWith(
          callbackMock,
          {
            root: rootNode,
            rootMargin: '10px 20px 30px 40px',
            threshold: [0, 0.5, 1],
          },
        )
      })

      targetNode.remove()
      rootNode.remove()
    })

    it('each target will be observed when the target is an array of elements', async () => {
      const targetNode = createNodeWithId('target-node-1')
      const targetNode_2 = createNodeWithId('target-node-2')

      useIntersectionObserver(
        [targetNode, targetNode_2],
        callbackMock,
      )

      await vi.waitFor(() => {
        expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)

        expect(observeMock).toHaveBeenCalledTimes(2)
        expect(observeMock.mock.calls[0][0]).toBe(targetNode)
        expect(observeMock.mock.calls[1][0]).toBe(targetNode_2)
      })
    })

    describe('when using in a component', () => {
      const ChildComponent = defineComponent({
        template: '<div id="child-component" />',
      })
      const component = defineComponent({
        template: `
        <div>
          <div ref="template-ref-el" id="template-ref-el" />
          <ChildComponent ref="child-component-ref" />
          <div id="target-node-1" />
          <div id="target-node-2" />
        </div>
        `,
        components: {
          ChildComponent,
        },
        setup() {
          const templateRefEl = useTemplateRef<HTMLElement>('template-ref-el')
          const childComponentRef = useTemplateRef<HTMLElement>('child-component-ref')
          const computedTarget = computed(() => document.getElementById('target-node-2'))

          onMounted(() => {
            useIntersectionObserver(
              [templateRefEl, childComponentRef, document.getElementById('target-node-1'), computedTarget],
              callbackMock,
            )
          })
        },
      })

      it('initialize IntersectionObserver and observe targets correctly', async () => {
        page.render(component)

        await vi.waitFor(() => {
          expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
          expect(IntersectionObserverMock).toHaveBeenCalledWith(
            callbackMock,
            {
              root: undefined,
              rootMargin: '0px',
              threshold: 0,
            },
          )

          expect(observeMock).toHaveBeenCalledTimes(4)
          expect(observeMock.mock.calls[0][0]).toHaveProperty('id', 'template-ref-el')
          expect(observeMock.mock.calls[1][0]).toHaveProperty('id', 'child-component')
          expect(observeMock.mock.calls[2][0]).toHaveProperty('id', 'target-node-1')
          expect(observeMock.mock.calls[3][0]).toHaveProperty('id', 'target-node-2')
        })
      })

      it('disconnect IntersectionObserver on unmount', async () => {
        page.render(component)

        await vi.waitFor(() => {
          expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
        })

        cleanup()

        await vi.waitFor(() => {
          expect(disconnectMock).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  it('can pause and resume observing', async () => {
    const targetNode = createNodeWithId('target-node')
    targetNode.textContent = 'Target Node'
    // use margin-top to push it out of the viewport
    targetNode.style.marginTop = 'calc(100vh + 10px)'

    const callbackMock = vi.fn()
    const { isActive, pause, resume } = useIntersectionObserver(
      targetNode,
      callbackMock,
    )

    // clear the immediate call
    callbackMock.mockClear()

    // scroll 10px down, should touch the targetNode
    window.scrollTo(0, 10)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
    })

    // scroll back to top
    window.scrollTo(0, 0)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
    })

    callbackMock.mockClear()

    pause()
    expect(isActive.value).toBe(false)

    // scroll 10px down, should NOT trigger callback since it's paused
    window.scrollTo(0, 10)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(0)
    })

    callbackMock.mockClear()

    resume()
    expect(isActive.value).toBe(true)

    // immediate call after resume
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
    })

    // scroll back to top, should trigger callback since it's resumed
    window.scrollTo(0, 0)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
    })
  })
})
