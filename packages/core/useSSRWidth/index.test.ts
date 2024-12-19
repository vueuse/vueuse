import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { provideSSRWidth, useSSRWidth } from '.'

describe('useSSRWidth', () => {
  it('should be undefined by default', () => {
    expect(useSSRWidth()).toBeUndefined()
  })

  it('should provide the set value through app', () => {
    const app = createSSRApp({ render: () => '' })
    provideSSRWidth(500, app)
    const ssrWidth = app.runWithContext(() => useSSRWidth())
    expect(ssrWidth).toBe(500)
  })

  it('should provide the set value through provide', () => {
    const wrapper = mount({ setup: () => {
      provideSSRWidth(700)
      return () => h({ render: () => {
        return useSSRWidth()
      } })
    } })
    expect(wrapper.html()).toBe('700')
  })

  it('should provide the set value through provide locally', () => {
    const wrapper = mount({ setup: () => {
      provideSSRWidth(800)
      const ssrWidth = useSSRWidth()
      return () => h({ render: () => {
        return ssrWidth
      } })
    } })
    expect(wrapper.html()).toBe('800')
  })
})
