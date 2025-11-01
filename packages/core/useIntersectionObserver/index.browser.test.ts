import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('target is reactive', async () => {
    document.body.innerHTML = `
      <div class="spacer" style="height: calc(100vh + 10px);"></div>
      <div id="target-node-1" style="height: 100px;">Target Node 1</div>
      <div id="target-node-2" style="height: 100px;">Target Node 2</div>
    `
    const targetNode_1 = document.getElementById('target-node-1')
    const targetNode_2 = document.getElementById('target-node-2')
    const targetRef = shallowRef<HTMLElement | null>(null)

    const callbackMock = vi.fn()

    useIntersectionObserver(
      targetRef,
      callbackMock,
    )

    callbackMock.mockClear()

    targetRef.value = targetNode_1

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
      expect(callbackMock.mock.calls[0][0][0].target.id).toBe('target-node-1')
    })

    window.scrollTo(0, 200)

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
      expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(true)
      expect(callbackMock.mock.calls[1][0][0].target.id).toBe('target-node-1')
    })

    callbackMock.mockClear()

    targetRef.value = targetNode_2

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
      expect(callbackMock.mock.calls[0][0][0].target.id).toBe('target-node-2')
    })

    window.scrollTo(0, 0)

    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(2)
      expect(callbackMock.mock.calls[1][0][0].isIntersecting).toBe(false)
      expect(callbackMock.mock.calls[1][0][0].target.id).toBe('target-node-2')
    })
  })

  it('root is reactive', async () => {
    document.body.innerHTML = `
      <div class="spacer" style="height: calc(100vh + 10px);"></div>
      <div id="root-node" style="height: 200px; overflow: scroll; border: 1px solid red;">
        <div id="target-node" style="height: 100px;">Target Node</div>
        <div class="spacer" style="height: 400px;"></div>
      </div>
    `
    const rootNode = document.getElementById('root-node')!
    const targetNode = document.getElementById('target-node')!
    const rootRef = shallowRef<HTMLElement | null>(null)

    const callbackMock = vi.fn()

    useIntersectionObserver(
      targetNode,
      callbackMock,
      { root: rootRef },
    )

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

    // change root to the rootNode, which updates the observer
    rootRef.value = rootNode
    callbackMock.mockClear()

    // viewport's intersection isn't observed any more
    window.scrollTo(0, 0)
    await nextTick()
    expect(callbackMock).toHaveBeenCalledTimes(0)

    rootNode.scrollTo(0, 300)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(false)
      // verify if the root changes to the 200px height rootNode
      expect(callbackMock.mock.calls[0][0][0].rootBounds.height).toBe(200)
    })
  })

  it('the observer will not start in the beginning if immediate: false', async () => {
    document.body.innerHTML = `
      <div class="spacer" style="height: calc(100vh + 10px);"></div>
      <div id="target-node" style="height: 100px;">Target Node</div>
    `
    const targetNode = document.getElementById('target-node')
    const callbackMock = vi.fn()

    const { isActive, resume } = useIntersectionObserver(
      targetNode,
      callbackMock,
      { immediate: false },
    )

    expect(isActive.value).toBe(false)

    window.scrollTo(0, 100)

    await expect(
      vi.waitUntil(() => {
        expect(callbackMock).toHaveBeenCalled()
      }, { timeout: 100 }),
    ).rejects.toThrow()

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
    document.body.innerHTML = `
      <div class="spacer" style="height: calc(100vh + 10px);"></div>
      <div id="target-node" style="height: 100px;">Target Node</div>
    `
    const targetNode = document.getElementById('target-node')
    const callbackMock = vi.fn()

    const { stop, resume, isActive } = useIntersectionObserver(
      targetNode,
      callbackMock,
    )

    // clear the immediate call
    callbackMock.mockClear()

    // scroll to intersect
    window.scrollTo(0, 100)
    await vi.waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1)
      expect(callbackMock.mock.calls[0][0][0].isIntersecting).toBe(true)
    })

    stop()
    expect(isActive.value).toBe(false)

    callbackMock.mockClear()

    // scroll back, should not trigger callback
    window.scrollTo(0, 0)
    await vi.waitFor(() => {
      expect(callbackMock).not.toHaveBeenCalled()
    })

    // resume won't work after stop
    resume()

    // scroll again, should not trigger callback
    window.scrollTo(0, 100)
    await vi.waitFor(() => {
      expect(callbackMock).not.toHaveBeenCalled()
    })
  })
})
