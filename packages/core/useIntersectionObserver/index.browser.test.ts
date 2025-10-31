import { afterEach, describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('can change targets reactively', async () => {
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
})
