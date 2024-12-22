import { provideSSRWidth } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { createSSRApp } from 'vue'
import { breakpointsBootstrapV5, useBreakpoints } from '.'

describe('useBreakpoints', () => {
  it('should be defined', () => {
    expect(useBreakpoints).toBeDefined()
  })

  it('should support ssr breakpoints', async () => {
    const breakpoints = useBreakpoints(breakpointsBootstrapV5, { window: null as unknown as undefined, ssrWidth: 768 })
    expect(breakpoints.current().value).toStrictEqual(['xs', 'sm', 'md'])
    expect(breakpoints.active().value).toBe('md')
    expect(breakpoints.isGreater('md')).toBe(false)
    expect(breakpoints.isGreaterOrEqual('md')).toBe(true)
    expect(breakpoints.isSmaller('md')).toBe(false)
    expect(breakpoints.isSmallerOrEqual('md')).toBe(true)
    expect(breakpoints.isInBetween('md', 'lg')).toBe(true)
    expect(breakpoints.isInBetween('sm', 'md')).toBe(false)
    expect(breakpoints.md.value).toBe(true)
    expect(breakpoints.lg.value).toBe(false)
    expect(breakpoints.sm.value).toBe(true)
  })

  it('should support max-width strategy', async () => {
    const breakpoints = useBreakpoints({
      xl: 1399,
      lg: 1199,
      md: 991,
      sm: 767,
      xs: 575,
    }, { strategy: 'max-width', window: null as unknown as undefined, ssrWidth: 768 })
    expect(breakpoints.current().value).toStrictEqual(['md', 'lg', 'xl'])
    expect(breakpoints.active().value).toBe('md')
    expect(breakpoints.isGreater('md')).toBe(false)
    expect(breakpoints.isGreaterOrEqual('sm')).toBe(true)
    expect(breakpoints.isSmaller('md')).toBe(true)
    expect(breakpoints.isSmallerOrEqual('sm')).toBe(false)
    expect(breakpoints.isInBetween('md', 'lg')).toBe(false)
    expect(breakpoints.isInBetween('sm', 'md')).toBe(true)
    expect(breakpoints.md.value).toBe(true)
    expect(breakpoints.lg.value).toBe(true)
    expect(breakpoints.sm.value).toBe(false)
  })

  it('should get the ssr width from the global store', async () => {
    const app = createSSRApp({ render: () => '' })
    provideSSRWidth(768, app)
    await app.runWithContext(async () => {
      const breakpoints = useBreakpoints(breakpointsBootstrapV5, { window: null as unknown as undefined })
      expect(breakpoints.current().value).toStrictEqual(['xs', 'sm', 'md'])
    })
  })
})
