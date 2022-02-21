import { ref } from 'vue-demi'
import { useContainerQuery } from '../useContainerQuery'

describe('useContainerQuery', () => {
  it('should be defined', () => {
    expect(useContainerQuery).toBeDefined()
  })

  it('should be set to default breakpoint', () => {
    const element = ref(null)

    const {
      activeBreakpoint,
      width,
    } = useContainerQuery({ element })

    // default
    expect(activeBreakpoint).toBe('sm')

    // small screen size in pixels (no change)
    width.value = 479
    expect(activeBreakpoint).toBe('sm')

    // medium screen size in pixels
    width.value = 481
    expect(activeBreakpoint).toBe('md')

    width.value = 600
    expect(activeBreakpoint).toBe('md')

    width.value = 768
    expect(activeBreakpoint).toBe('md')

    // large screen size in pixels
    width.value = 769
    expect(activeBreakpoint).toBe('lg')

    width.value = 900
    expect(activeBreakpoint).toBe('lg')

    width.value = 1024
    expect(activeBreakpoint).toBe('lg')

    // extra large screen size in pixels
    width.value = 1025
    expect(activeBreakpoint).toBe('xl')

    width.value = 1100
    expect(activeBreakpoint).toBe('xl')

    width.value = 1200
    expect(activeBreakpoint).toBe('xl')

    // extra extra large screen size in pixels (lower boundary)
    width.value = 1201
    expect(activeBreakpoint).toBe('xxl')

    // extra extra large screen size in pixels (stupidly large)
    width.value = 10000
    expect(activeBreakpoint).toBe('xxl')
  })
})
