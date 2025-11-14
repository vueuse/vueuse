import type { UseIntersectionObserverReturn } from '.'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, shallowRef, toValue, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    window.scrollTo(0, 0)
  })

  const expectFunctionHasNotBeenCalled = async (callbackMock: any) => {
    await expect(
      vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalled()
      }, { timeout: 100 }),
    ).rejects.toThrow()
  }

  describe('observe the intersection of the target and the root', () => {
    it('root is viewport by default', async () => {
      const callbackMock = vi.fn()

      const Component = defineComponent({
        template: `
          <div>
            <div class="spacer" style="height: calc(100vh + 10px);"></div>
            <div ref="target-node" style="height: 100px;">Target Node</div>
          </div>
        `,
        setup() {
          const targetNodeRef = useTemplateRef<HTMLElement>('target-node')

          useIntersectionObserver(
            targetNodeRef,
            callbackMock,
          )
        },
      })

      page.render(Component)

      // immediate call
      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
      })

      window.scrollTo(0, 100)

      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(2)
        expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(true)
      })
    })

    it('can specify different root', async () => {
      const callbackMock = vi.fn()

      const Component = defineComponent({
        template: `
          <div>
            <div ref="root-node" id="root-node" style="height: 200px; overflow: scroll;">
              <div ref="target-node" style="height: 100px;">Target Node</div>
              <div class="spacer" style="height: 400px;"></div>
            </div>
            <div class="spacer" style="height: calc(100vh + 10px);"></div>
          </div>
        `,
        setup() {
          const targetNodeRef = useTemplateRef<HTMLElement>('target-node')
          const rootNodeRef = useTemplateRef<HTMLElement>('root-node')

          useIntersectionObserver(
            targetNodeRef,
            callbackMock,
            { root: rootNodeRef }, // specify the root
          )
        },
      })

      page.render(Component)

      // immediate call
      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
        // rootBounds.height == 200px shows that it is the specified root-node
        expect(callbackMock.mock.calls[0][0][0].rootBounds!.height).toBe(200)
      })

      callbackMock.mockClear()

      // scroll window should not trigger the observer
      window.scrollTo(0, 200)
      await expectFunctionHasNotBeenCalled(callbackMock)

      const rootNode = document.getElementById('root-node')!

      rootNode.scrollTo(0, 200)
      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
        expect(callbackMock.mock.calls[0][0][0].rootBounds!.height).toBe(200)
      })

      rootNode.scrollTo(0, 0)
      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(2)
        expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(true)
        expect(callbackMock.mock.calls[0][0][0].rootBounds!.height).toBe(200)
      })
    })

    it('rootMargin can extend the root as intersection region', async () => {
      const callbackMock = vi.fn()

      const Component = defineComponent({
        template: `
          <div ref="root-node" id="root-node" style="height: 200px; overflow: scroll;">
            <div class="spacer" style="height: 210px;"></div>
            <div ref="target-node" style="height: 100px;">Target Node</div>
          </div>
        `,
        setup() {
          const targetNodeRef = useTemplateRef<HTMLElement>('target-node')
          const rootNodeRef = useTemplateRef<HTMLElement>('root-node')

          useIntersectionObserver(
            targetNodeRef,
            callbackMock,
            {
              root: rootNodeRef,
              rootMargin: '10px',
            },
          )
        },
      })

      page.render(Component)

      // The target is 10px below the rootNode, but the rootMargin is 10px, so it should be intersecting
      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
      })
    })

    it('threshold controls at what visibility percentage the intersection callback is fired', async () => {
      const callbackMock = vi.fn()

      const Component = defineComponent({
        template: `
          <div class="spacer" style="height: calc(100vh + 10px);"></div>
          <div ref="target-node" style="height: 100px;">Target Node</div>
          <div class="spacer" style="height: 500px;"></div>
        `,
        setup() {
          const targetNodeRef = useTemplateRef<HTMLElement>('target-node')

          useIntersectionObserver(
            targetNodeRef,
            callbackMock,
            { threshold: [0, 0.5, 1] },
          )
        },
      })

      page.render(Component)

      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(callbackMock.mock.calls[0][0][0].intersectionRatio).toBe(0)
        expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
      })
      callbackMock.mockClear()

      // scroll 10px down to "touch" the target
      window.scrollTo(0, 10)
      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(callbackMock.mock.calls[0][0][0].intersectionRatio).toBe(0)
        expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
      })
      callbackMock.mockClear()

      // scroll to show 50% of the target
      window.scrollTo(0, 60)
      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(callbackMock.mock.calls[0][0][0].intersectionRatio).toBeCloseTo(0.5)
        expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
      })
      callbackMock.mockClear()

      // scroll far beyond the target
      window.scrollTo(0, 200)
      await vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(callbackMock.mock.calls[0][0][0].intersectionRatio).toBe(1)
        expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
      })
    })
  })

  it('target is reactive', async () => {
    const callbackMock = vi.fn()
    const target = shallowRef<HTMLElement | null>(null)

    let targetNode1
    let targetNode2

    const Component = defineComponent({
      template: `
        <div>
          <div class="spacer" style="height: calc(100vh + 10px);"></div>
          <div ref="target-node-1" style="height: 100px;">Target Node 1</div>
          <div ref="target-node-2" style="height: 100px;">Target Node 2</div>
        </div>
      `,
      props: {
        target: {
          type: Object,
          required: true,
        },
      },
      setup() {
        targetNode1 = useTemplateRef<HTMLElement>('target-node-1')
        targetNode2 = useTemplateRef<HTMLElement>('target-node-2')

        useIntersectionObserver(target, callbackMock)
      },
    })

    page.render(Component, {
      props: {
        target,
      },
    })

    target.value = targetNode1!

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
      expect(callbackMock.mock.calls[0][0][0].target.textContent).toBe('Target Node 1')
    })

    window.scrollTo(0, 200)

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
      expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(true)
      expect(callbackMock.mock.calls[1][0][0].target.textContent).toBe('Target Node 1')
    })

    callbackMock.mockClear()

    target.value = targetNode2!

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
      expect(callbackMock.mock.calls[0][0][0].target.textContent).toBe('Target Node 2')
    })

    window.scrollTo(0, 0)

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
      expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(false)
      expect(callbackMock.mock.calls[1][0][0].target.textContent).toBe('Target Node 2')
    })
  })

  it('root is reactive', async () => {
    const callbackMock = vi.fn()
    const root = shallowRef<HTMLElement | null>(null)
    let rootNode

    const Component = defineComponent({
      template: `
        <div>
          <div class="spacer" style="height: calc(100vh + 10px);"></div>
          <div ref="root-node" style="height: 200px; overflow: scroll; border: 1px solid red;">
            <div ref="target-node" style="height: 100px;">Target Node</div>
            <div class="spacer" style="height: 400px;"></div>
          </div>
        </div>
      `,
      setup() {
        const targetNodeRef = useTemplateRef<HTMLElement>('target-node')
        rootNode = useTemplateRef<HTMLElement>('root-node')

        useIntersectionObserver(
          targetNodeRef,
          callbackMock,
          { root },
        )
      },
    })

    page.render(Component)

    // root is viewport by default
    // immediate call
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
    })

    // scroll viewport and show the targetNode
    window.scrollTo(0, 100)

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
      expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(true)
    })

    callbackMock.mockClear()

    // change root to the rootNode, which updates the observer
    root.value = rootNode!

    // immediate call after the root change
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
      // verify if the root changes to the 200px height rootNode
      expect(callbackMock.mock.calls[0][0][0].rootBounds!.height).toBe(200)
    })
    callbackMock.mockClear()

    // viewport's intersection isn't observed any more
    window.scrollTo(0, 0)
    await expectFunctionHasNotBeenCalled(callbackMock)

    rootNode!.value.scrollTo(0, 300)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
      // verify if the root changes to the 200px height rootNode
      expect(callbackMock.mock.calls[0][0][0].rootBounds!.height).toBe(200)
    })
  })

  it('the observer will not start in the beginning if immediate: false', async () => {
    const callbackMock = vi.fn()
    let observerReturn: UseIntersectionObserverReturn

    const Component = defineComponent({
      template: `
        <div>
          <div class="spacer" style="height: calc(100vh + 10px);"></div>
          <div ref="target-node" style="height: 100px;">Target Node</div>
        </div>
      `,
      setup() {
        const target = useTemplateRef<HTMLElement>('target-node')
        observerReturn = useIntersectionObserver(
          target,
          callbackMock,
          { immediate: false },
        )
      },
    })

    page.render(Component)

    await expectFunctionHasNotBeenCalled(callbackMock)

    const { isActive, resume } = observerReturn!
    expect(isActive.value).toBe(false)

    window.scrollTo(0, 100)
    await expectFunctionHasNotBeenCalled(callbackMock)

    resume()
    expect(isActive.value).toBe(true)

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
    })
  })

  it('isSupport is always true when in the browser mode', () => {
    let observerReturn: UseIntersectionObserverReturn

    const Component = defineComponent({
      template: `
        <div ref="target-node">
          Target Node
        </div>
      `,
      setup() {
        const target = useTemplateRef<HTMLElement>('target-node')
        observerReturn = useIntersectionObserver(target, () => {})
      },
    })

    page.render(Component)
    expect(observerReturn!.isSupported.value).toBe(true)
  })

  it('supports Pausable, can pause and resume', async () => {
    const callbackMock = vi.fn()
    let observerReturn: UseIntersectionObserverReturn

    const Component = defineComponent({
      template: `
        <div>
          <div class="spacer" style="height: calc(100vh + 10px);"></div>
          <div ref="target-node" style="height: 100px;">Target Node</div>
        </div>
      `,
      setup() {
        const target = useTemplateRef<HTMLElement>('target-node')
        observerReturn = useIntersectionObserver(
          target,
          callbackMock,
        )
      },
    })

    page.render(Component)
    expect(observerReturn!.isActive.value).toBe(true)

    // immediate call
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
    })

    window.scrollTo(0, 100)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
      expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(true)
    })

    // scroll back to top
    window.scrollTo(0, 0)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(3)
      expect(callbackMock.mock.calls[2][0][0].isIntersecting).toBe(false)
    })

    callbackMock.mockClear()

    observerReturn!.pause()
    expect(observerReturn!.isActive.value).toBe(false)

    // scroll 100px down again, should NOT trigger callback since it's paused
    window.scrollTo(0, 100)
    await expectFunctionHasNotBeenCalled(callbackMock)

    observerReturn!.resume()
    expect(observerReturn!.isActive.value).toBe(true)

    // immediate call after resume
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
    })

    // scroll back to top, should trigger callback since it's resumed
    window.scrollTo(0, 0)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
      expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(false)
    })
  })

  it('stop observing when calling stop, not be able to resume', async () => {
    const callbackMock = vi.fn()
    let observerReturn: UseIntersectionObserverReturn

    const Component = defineComponent({
      template: `
        <div class="spacer" style="height: calc(100vh + 10px);"></div>
        <div ref="target-node" style="height: 100px;">Target Node</div>
      `,
      setup() {
        const target = useTemplateRef<HTMLElement>('target-node')
        observerReturn = useIntersectionObserver(
          target,
          callbackMock,
        )
      },
    })

    page.render(Component)

    // immediate call
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
    })

    // scroll to intersect
    window.scrollTo(0, 100)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
      expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(true)
    })
    callbackMock.mockClear()

    observerReturn!.stop()
    expect(toValue(observerReturn!.isActive)).toBe(false)

    // scroll back, should not trigger callback
    window.scrollTo(0, 0)
    await expectFunctionHasNotBeenCalled(callbackMock)

    // resume won't work after stop
    observerReturn!.resume()

    // scroll again, should not trigger callback
    window.scrollTo(0, 100)
    await expectFunctionHasNotBeenCalled(callbackMock)
  })

  it('observer will stop when unmounted', async () => {
    let observerReturn: UseIntersectionObserverReturn

    const Component = defineComponent({
      template: `
        <div ref="target-node">
          Target Node
        </div>
      `,
      setup() {
        const target = useTemplateRef<HTMLElement>('target-node')
        observerReturn = useIntersectionObserver(target, () => {})
      },
    })

    page.render(Component)

    cleanup()

    expect(observerReturn!.isActive.value).toBe(false)
  })
})
