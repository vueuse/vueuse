import type { UseIntersectionObserverReturn } from '.'
import { page } from '@vitest/browser/context'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, shallowRef, toValue, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  const expectFunctionHasNotBeenCalled = async (callbackMock: any) => {
    await expect(
      vi.waitFor(() => {
        expect(callbackMock).toHaveBeenCalled()
      }, { timeout: 100 }),
    ).rejects.toThrow()
  }

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
    const { isSupported } = useIntersectionObserver(
      document.createElement('div'),
      () => {},
    )

    expect(isSupported.value).toBe(true)
  })

  it('can pause and resume observing', async () => {
    document.body.innerHTML = `
      <div class="spacer" style="height: calc(100vh + 10px);"></div>
      <div id="target-node" style="height: 100px;">Target Node</div>
    `

    const targetNode = document.getElementById('target-node')

    const callbackMock = vi.fn()
    const { isActive, pause, resume } = useIntersectionObserver(
      targetNode,
      callbackMock,
    )

    // clear the immediate call
    callbackMock.mockClear()

    // scroll 10px down, should touch the targetNode
    window.scrollTo(0, 100)
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

  it('stop observing when calling stop, not be able to resume', async () => {
    const callbackMock = vi.fn()

    let observerReturn: UseIntersectionObserverReturn

    const Component = {
      template: `
        <div class="spacer" style="height: calc(100vh + 10px);"></div>
        <div ref="targetNode" id="target-node" style="height: 100px;">Target Node</div>
      `,
      setup() {
        const targetNode = shallowRef<HTMLElement | null>(null)
        observerReturn = useIntersectionObserver(
          targetNode,
          callbackMock,
        )

        return {
          targetNode,
        }
      },
    }

    page.render(Component)

    // clear the immediate call
    callbackMock.mockClear()

    // scroll to intersect
    window.scrollTo(0, 100)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
    })

    observerReturn!.stop()
    expect(toValue(observerReturn!.isActive)).toBe(false)

    callbackMock.mockClear()

    // scroll back, should not trigger callback
    window.scrollTo(0, 0)
    await expectFunctionHasNotBeenCalled(callbackMock)

    // resume won't work after stop
    observerReturn!.resume()

    // scroll again, should not trigger callback
    window.scrollTo(0, 100)
    await expectFunctionHasNotBeenCalled(callbackMock)
  })
})
