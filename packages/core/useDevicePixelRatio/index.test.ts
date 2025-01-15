import { describe, expect, it } from 'vitest'
import { useDevicePixelRatio } from '.'

describe('useDevicePixelRatio', () => {
  it('should be defined', () => {
    expect(useDevicePixelRatio).toBeDefined()
  })

  it('should default to 1', async () => {
    const { pixelRatio } = useDevicePixelRatio()
    expect(pixelRatio.value).toBe(1)
  })
})
