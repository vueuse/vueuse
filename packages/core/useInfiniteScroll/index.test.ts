import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref as deepRef } from 'vue'
import { useElementVisibility } from '../useElementVisibility'
import { useInfiniteScroll } from './index'

vi.mock('../useElementVisibility')

describe('useInfiniteScroll', () => {
  it('should be defined', () => {
    expect(useInfiniteScroll).toBeDefined()
  })

  it.each([
    [deepRef(givenMockElement())],
    [givenMockElement()],
    [document],
    [window],
  ])('should calls the loadMore handler, when element is visible', (target) => {
    const mockHandler = vi.fn()
    givenElementVisibilityRefMock(true)

    useInfiniteScroll(target, mockHandler)

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should calls the loadMore handler, when element visibility state form hidden to visible', async () => {
    const mockHandler = vi.fn()
    const mockElement = givenMockElement()
    const visibilityRefMock = givenElementVisibilityRefMock(false)

    useInfiniteScroll(mockElement, mockHandler)

    expect(mockHandler).not.toHaveBeenCalled()

    visibilityRefMock.value = true
    await flushPromises()

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should call the loadMore handler, when user scrolls', async () => {
    const mockElementScrollHeight = 100
    const mockHandler = vi.fn()
    const mockElement = givenMockElement({
      scrollHeight: mockElementScrollHeight,
    })
    givenElementVisibilityRefMock(true)

    useInfiniteScroll(mockElement, mockHandler)
    mockElement.scrollTop = mockElementScrollHeight
    mockElement.dispatchEvent(new Event('scroll'))
    await flushPromises()

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should not call loadMore when canLoadMore returns false', async () => {
    const mockHandler = vi.fn()
    const mockElement = givenMockElement()
    givenElementVisibilityRefMock(true)

    useInfiniteScroll(mockElement, mockHandler, {
      canLoadMore: () => false,
    })

    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('should call loadMore when canLoadMore returns true', async () => {
    const mockHandler = vi.fn()
    const mockElement = givenMockElement()
    givenElementVisibilityRefMock(true)

    useInfiniteScroll(mockElement, mockHandler, {
      canLoadMore: () => true,
    })

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should stop calling loadMore when canLoadMore changes from true to false', async () => {
    const mockHandler = vi.fn()
    const mockElement = givenMockElement()
    givenElementVisibilityRefMock(true)

    const canLoad = deepRef(true)
    const canLoadMoreSpy = vi.fn(() => canLoad.value)
    useInfiniteScroll(mockElement, mockHandler, {
      canLoadMore: canLoadMoreSpy,
    })

    await flushPromises()
    expect(mockHandler).toHaveBeenCalledTimes(1)

    canLoad.value = false

    mockElement.dispatchEvent(new Event('scroll'))
    await flushPromises()

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should call loadMore when canLoadMore changes from false to true', async () => {
    const mockHandler = vi.fn()
    const mockElement = givenMockElement()
    givenElementVisibilityRefMock(true)

    const canLoad = deepRef(false)
    const canLoadMoreSpy = vi.fn(() => canLoad.value)
    useInfiniteScroll(mockElement, mockHandler, {
      canLoadMore: canLoadMoreSpy,
    })

    await flushPromises()
    expect(mockHandler).not.toHaveBeenCalled()

    canLoad.value = true

    mockElement.dispatchEvent(new Event('scroll'))
    await flushPromises()

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  function givenMockElement({
    scrollHeight = 0,
  } = {}): HTMLDivElement {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'scrollHeight', {
      value: scrollHeight,
    })
    return mockElement
  }

  function givenElementVisibilityRefMock(defaultValue: boolean) {
    const mockVisibilityRef = deepRef(defaultValue)
    vi.mocked(useElementVisibility).mockReturnValue(mockVisibilityRef)
    return mockVisibilityRef
  }
})
