import { describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  const createNodeWithId = (id: string) => {
    const node = document.createElement('div')
    node.id = id
    document.body.appendChild(node)
    return node
  }

  it('can change targets reactively', async () => {
    const targetNode_1 = createNodeWithId('target-node-1')
    targetNode_1.textContent = 'Target Node 1'
    targetNode_1.style.height = '100px'
    targetNode_1.style.marginTop = 'calc(100vh + 10px)'
    const targetNode_2 = createNodeWithId('target-node-2')
    targetNode_2.textContent = 'Target Node 2'
    targetNode_2.style.height = '100px'
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

    targetNode_1.remove()
    targetNode_2.remove()
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

    targetNode.remove()
  })
})
