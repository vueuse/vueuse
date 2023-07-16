import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue-demi'
import { useElementVisibility } from '../useElementVisibility'
import { useInfiniteScroll } from '.'

vi.mock('../useElementVisibility')
describe('useInfiniteScroll', () => {
  const scrollEvent = new Event('scroll')
  it('should be defined', () => {
    expect(useInfiniteScroll).toBeDefined()
  })

  it.each([
    [ref(givenMockElement())],
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
    vi.useFakeTimers({
      toFake: ['setTimeout'],
    })
    const mockHandler = vi.fn()
    const mockElement = givenMockElement()
    givenElementVisibilityRefMock(true)

    useInfiniteScroll(mockElement, mockHandler)
    expect(mockHandler).toHaveBeenCalledTimes(1)

    await vi.advanceTimersToNextTimer()
    await flushPromises()
    mockElement.dispatchEvent(scrollEvent)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })

  function givenMockElement() {
    return document.createElement('div')
  }

  function givenElementVisibilityRefMock(defaultValue: boolean) {
    const mockVisibilityRef = ref(defaultValue)
    vi.mocked(useElementVisibility).mockReturnValue(mockVisibilityRef)
    return mockVisibilityRef
  }
})
