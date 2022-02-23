import { rand } from '@vueuse/shared'
import { useContainerQuery } from '../useContainerQuery'
import { matchBreakPoint } from './matchBreakPoint'

describe('useContainerQuery', () => {
  const breakpoints = {
    sm: {
      max: 480,
    },
    md: {
      min: 481,
      max: 768,
    },
    lg: {
      min: 769,
      max: 1024,
    },
    xl: {
      min: 1025,
      max: 1200,
    },
    xxl: {
      min: 1201,
    },
  }

  it('should be defined', () => {
    expect(useContainerQuery).toBeDefined()
  })

  it('should be undefined', () => {
    expect(matchBreakPoint(breakpoints, -1)).toBeUndefined()
  })

  it('should be sm', () => {
    expect(matchBreakPoint(breakpoints, rand(0, 480))).toBe('sm')
  })

  it('should be md', () => {
    expect(matchBreakPoint(breakpoints, rand(481, 768))).toBe('md')
  })

  it('should be lg', () => {
    expect(matchBreakPoint(breakpoints, rand(769, 1024))).toBe('lg')
  })

  it('should be xl', () => {
    expect(matchBreakPoint(breakpoints, rand(1025, 1200))).toBe('xl')
  })

  it('should be xxl', () => {
    expect(matchBreakPoint(breakpoints, rand(1201, 9999))).toBe('xxl')
  })

  it('should rounding width', () => {
    expect(matchBreakPoint(breakpoints, 480.4)).toBe('sm')
    expect(matchBreakPoint(breakpoints, 480.5)).toBe('md')
  })
})
