import { describe, expect, it } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { useMediaSession } from './index'

describe('useMediaSession SSR', () => {
  it('should allow state updates and cleanup without browser APIs', async () => {
    const scope = effectScope()
    try {
      const api = scope.run(() => useMediaSession())!

      expect(api.isSupported.value).toBe(false)
      expect(api.isSetCameraSupported.value).toBe(false)
      expect(api.isSetMicrophoneSupported.value).toBe(false)

      api.title.value = 'Track'
      api.playbackState.value = 'playing'
      api.playbackRate.value = 1
      api.actionHandlers.value = { play: () => {} }
      api.cameraActive.value = true
      api.microphoneActive.value = true
      await nextTick()

      expect(() => api.clear()).not.toThrow()
    }
    finally {
      scope.stop()
    }
  })
})
