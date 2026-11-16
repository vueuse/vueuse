import { describe, expect, it } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { useMediaSession } from './index'

describe('useMediaSession SSR', () => {
  it('should allow state updates and cleanup without browser APIs', async () => {
    const scope = effectScope()
    try {
      const title = shallowRef<string>()
      const playbackState = shallowRef<MediaSessionPlaybackState>('none')
      const playbackRate = shallowRef<number>()
      const cameraActive = shallowRef(false)
      const microphoneActive = shallowRef(false)
      const api = scope.run(() => useMediaSession({
        title,
        playbackState,
        playbackRate,
        cameraActive,
        microphoneActive,
        onPlay: () => {},
      }))!

      expect(api.isSupported.value).toBe(false)
      expect(api.isSetCameraSupported.value).toBe(false)
      expect(api.isSetMicrophoneSupported.value).toBe(false)

      title.value = 'Track'
      playbackState.value = 'playing'
      playbackRate.value = 1
      cameraActive.value = true
      microphoneActive.value = true
      await nextTick()
    }
    finally {
      scope.stop()
    }
  })
})
