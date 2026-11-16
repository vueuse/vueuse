import { describe, expect, it } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { useMediaSession } from './index'

describe('useMediaSession SSR', () => {
  it('should allow state updates and cleanup without browser APIs', async () => {
    const scope = effectScope()
    try {
      const metadata = shallowRef<MediaMetadataInit>()
      const playbackState = shallowRef<MediaSessionPlaybackState>('none')
      const positionState = shallowRef<MediaPositionState>()
      const cameraActive = shallowRef(false)
      const microphoneActive = shallowRef(false)
      const api = scope.run(() => useMediaSession(
        { metadata, playbackState, positionState, cameraActive, microphoneActive },
        { onPlay: () => {} },
      ))!

      expect(api.isSupported.value).toBe(false)
      expect(api.isSetCameraSupported.value).toBe(false)
      expect(api.isSetMicrophoneSupported.value).toBe(false)

      metadata.value = { title: 'Track' }
      playbackState.value = 'playing'
      positionState.value = { duration: 120, position: 10 }
      cameraActive.value = true
      microphoneActive.value = true
      await nextTick()

      expect(() => api.stop()).not.toThrow()
    }
    finally {
      scope.stop()
    }
  })
})
