import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, useTemplateRef } from 'vue'
import { useStickToBottom } from './index'

describe('useStickToBottom', () => {
  it('scrollToBottom sets scrollTop to calculated bottom', async () => {
    const api: any = {}

    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0)
      return 0 as any
    })

    const wrapper = mount({
      setup() {
        const scrollEl = useTemplateRef<HTMLElement>('scroll')
        const contentEl = useTemplateRef<HTMLElement>('content')

        const composable = useStickToBottom({
          scrollElement: scrollEl,
          contentElement: contentEl,
          initial: false,
        })

        Object.assign(api, { scrollEl, contentEl, ...composable })

        return () => h('div', [
          h('div', {
            'ref': 'scroll',
            'data-testid': 'scroll',
            'style': {
              height: '200px',
              overflow: 'auto',
            },
          }, [
            h('div', {
              'ref': 'content',
              'data-testid': 'content',
              'style': {
                height: '1000px',
              },
            }),
          ]),
        ])
      },
    })

    await nextTick()

    const viewport = wrapper.get('[data-testid="scroll"]').element as HTMLElement

    Object.defineProperty(viewport, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(viewport, 'clientHeight', { value: 200, configurable: true })

    viewport.scrollTop = 0

    const ok = await api.scrollToBottom(false)
    expect(ok).toBe(true)
    expect(viewport.scrollTop).toBe(799)

    rafSpy.mockRestore()
  })

  it('escapes when user scrolls up', async () => {
    const api: any = {}

    vi.useFakeTimers()
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0)
      return 0 as any
    })

    const wrapper = mount({
      setup() {
        const scrollEl = useTemplateRef<HTMLElement>('scroll')
        const contentEl = useTemplateRef<HTMLElement>('content')

        const composable = useStickToBottom({
          scrollElement: scrollEl,
          contentElement: contentEl,
          initial: false,
          offset: 10,
        })

        Object.assign(api, { scrollEl, contentEl, ...composable })

        return () => h('div', [
          h('div', {
            'ref': 'scroll',
            'data-testid': 'scroll',
            'style': {
              height: '200px',
              overflow: 'auto',
            },
          }, [
            h('div', {
              'ref': 'content',
              'data-testid': 'content',
              'style': {
                height: '1000px',
              },
            }),
          ]),
        ])
      },
    })

    await nextTick()

    const viewport = wrapper.get('[data-testid="scroll"]').element as HTMLElement
    Object.defineProperty(viewport, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(viewport, 'clientHeight', { value: 200, configurable: true })

    await api.scrollToBottomAndResume(false)
    expect(viewport.scrollTop).toBe(799)

    viewport.scrollTop = 600
    viewport.dispatchEvent(new Event('scroll'))

    await vi.runAllTimersAsync()

    expect(api.escapedFromLock.value).toBe(true)
    expect(api.isAtBottom.value).toBe(false)
    expect(api.showScrollToBottom.value).toBe(true)

    rafSpy.mockRestore()
    vi.useRealTimers()
  })
})
