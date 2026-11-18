import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isReadonly, shallowRef } from 'vue'
import { useEyeDropper } from './index'

describe('useEyeDropper', () => {
  beforeEach(() => {
    vi.stubGlobal('EyeDropper', class {
      open = async () => ({ sRGBHex: '#ff0000' })
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('state', () => {
    it('should return a readonly sRGBHex', () => {
      const { sRGBHex } = useEyeDropper()

      expect(isReadonly(sRGBHex)).toBe(true)
    })

    it('should update sRGBHex when a color is picked', async () => {
      const { sRGBHex, open } = useEyeDropper()

      await open()
      expect(sRGBHex.value).toBe('#ff0000')
    })
  })

  describe('initials', () => {
    it('should default to an empty string', () => {
      const { sRGBHex } = useEyeDropper()

      expect(sRGBHex.value).toBe('')
    })

    it('should seed from a plain value', () => {
      const { sRGBHex } = useEyeDropper({ initials: { sRGBHex: '#ffffff' } })

      expect(sRGBHex.value).toBe('#ffffff')
    })

    it('should use a passed ref as internal state', async () => {
      const sRGBHex = shallowRef('#ffffff')
      const eyeDropper = useEyeDropper({ initials: { sRGBHex } })

      expect(eyeDropper.sRGBHex).not.toBe(sRGBHex)

      await eyeDropper.open()
      expect(sRGBHex.value).toBe('#ff0000')

      sRGBHex.value = '#00ff00'
      expect(eyeDropper.sRGBHex.value).toBe('#00ff00')
    })

    it('should support deprecated initialValue', () => {
      const { sRGBHex } = useEyeDropper({ initialValue: '#ffffff' })

      expect(sRGBHex.value).toBe('#ffffff')
    })

    it('should prefer initials over deprecated initialValue', () => {
      const { sRGBHex } = useEyeDropper({ initialValue: '#ffffff', initials: { sRGBHex: '#000000' } })

      expect(sRGBHex.value).toBe('#000000')
    })
  })
})
