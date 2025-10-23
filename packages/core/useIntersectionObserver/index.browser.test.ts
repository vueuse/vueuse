import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { useIntersectionObserver } from '.'

describe('useIntersectionObserver', () => {
  describe('send IntersectionObserver messages', () => {
    const createNodeWithId = (id: string) => {
      const node = document.createElement('div')
      node.id = id
      document.body.appendChild(node)
      return node
    }

    const callbackMock = vi.fn()
    const disconnectMock = vi.fn()
    const observeMock = vi.fn()
    const IntersectionObserverMock = vi.fn(() => ({
      disconnect: disconnectMock,
      observe: observeMock,
    }))

    beforeAll(() => {
      vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
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
  })
})
