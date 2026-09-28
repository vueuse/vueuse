import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useSetup } from '../../.test'
import { useMediaSession } from './index'

const sampleMedia = {
  title: 'title',
  artist: 'artist',
  artwork: [{
    type: 'type',
    sizes: 'sizes',
    src: '/src',
  }],
  album: 'album',
}

function createMockNavigator(withCamera = true, withMicrophone = true) {
  return {
    mediaSession: {
      metadata: {} as MediaMetadata,
      playbackState: 'none' as MediaSessionPlaybackState,
      setActionHandler: vi.fn(),
      setPositionState: vi.fn(),
      ...withCamera ? { setCameraActive: vi.fn() } : {},
      ...withMicrophone ? { setMicrophoneActive: vi.fn() } : {},
    },
  } as unknown as Navigator
}

describe('useMediaSession', () => {
  it('should be defined', () => {
    expect(useMediaSession).toBeDefined()
  })

  it('should not be be supported if `navigator.mediaSession` not available', () => {
    const { isSupported } = useMediaSession({ navigator: {} as unknown as Navigator })
    expect(isSupported.value).toBe(false)
  })

  it('should update MediaSession `metadata` on states update', async () => {
    const navigator = createMockNavigator()
    const { album, artist, artwork, title } = useMediaSession({ navigator })

    album.value = sampleMedia.album
    artist.value = sampleMedia.artist
    artwork.value = sampleMedia.artwork
    title.value = sampleMedia.title

    await nextTick()

    expect(navigator.mediaSession.metadata?.album).toBe(sampleMedia.album)
    expect(navigator.mediaSession.metadata?.artist).toBe(sampleMedia.artist)
    expect(navigator.mediaSession.metadata?.artwork[0].type).toBe(sampleMedia.artwork[0].type)
    expect(navigator.mediaSession.metadata?.artwork[0].sizes).toBe(sampleMedia.artwork[0].sizes)
    expect(navigator.mediaSession.metadata?.artwork[0].src).toBe(`${window.location.origin}${sampleMedia.artwork[0].src}`)
    expect(navigator.mediaSession.metadata?.title).toBe(sampleMedia.title)
  })

  it('should update MediaSession `playbackState` on states update', async () => {
    const navigator = createMockNavigator()
    const { playbackState } = useMediaSession({ navigator })

    playbackState.value = 'playing'

    await nextTick()

    expect(navigator.mediaSession.playbackState).toBe<MediaSessionPlaybackState>('playing')
  })

  it('should call `setPositionState` on states update', async () => {
    const navigator = createMockNavigator()
    const { duration, playbackRate, position } = useMediaSession({ navigator })

    duration.value = 120
    playbackRate.value = 2
    position.value = 100

    await nextTick()

    expect(navigator.mediaSession.setPositionState).toHaveBeenLastCalledWith({
      duration: 120,
      playbackRate: 2,
      position: 100,
    })
  })

  it('should update `actionHandlers` on states update by calling it twice (Cancel and Re-register)', async () => {
    const navigator = createMockNavigator()
    const { actionHandlers, playbackState } = useMediaSession({ navigator })

    actionHandlers.value = {
      play: () => playbackState.value = 'playing',
      pause: () => playbackState.value = 'paused',
    }

    await nextTick()

    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', expect.any(Function))
    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('pause', expect.any(Function))

    actionHandlers.value = {
      play: () => playbackState.value = 'playing',
    }

    await nextTick()

    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', null)
    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('pause', null)
    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', expect.any(Function))
  })

  it('should have `isSetCameraSupport` as false if `setCameraActive()` not available', () => {
    const navigator = createMockNavigator(false, false)
    const { isSetCameraSupported } = useMediaSession({ navigator })

    expect(isSetCameraSupported.value).toBe(false)
  })

  it('should set camera active on states update', async () => {
    const navigator = createMockNavigator()
    const { cameraActive, isSetCameraSupported } = useMediaSession({ navigator })

    expect(isSetCameraSupported.value).toBe(true)

    cameraActive.value = true

    await nextTick()

    expect(navigator.mediaSession.setCameraActive).toHaveBeenLastCalledWith(true)
  })

  it('should have `isSetMicrophoneSupported` as false if `setMicrophoneActive()` not available', () => {
    const navigator = createMockNavigator(false, false)
    const { isSetMicrophoneSupported } = useMediaSession({ navigator })

    expect(isSetMicrophoneSupported.value).toBe(false)
  })

  it('should set microphone active on states update', async () => {
    const navigator = createMockNavigator()
    const { microphoneActive, isSetMicrophoneSupported } = useMediaSession({ navigator })

    expect(isSetMicrophoneSupported.value).toBe(true)

    microphoneActive.value = true

    await nextTick()

    expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenLastCalledWith(true)
  })

  it('should be reset when unmounted', async () => {
    const navigator = createMockNavigator()

    const vm = useSetup(() => {
      const api = useMediaSession({ navigator })

      api.album.value = sampleMedia.album
      api.artist.value = sampleMedia.artist
      api.artwork.value = sampleMedia.artwork
      api.title.value = sampleMedia.title

      api.duration.value = 120
      api.playbackRate.value = 2
      api.position.value = 100

      api.playbackState.value = 'playing'
      api.actionHandlers.value = {
        play: () => api.playbackState.value = 'playing',
      }
      return { api }
    })

    vm.unmount()
    await nextTick()

    expect(navigator.mediaSession.metadata?.album).not.toBeDefined()
    expect(navigator.mediaSession.metadata?.artist).not.toBeDefined()
    expect(navigator.mediaSession.metadata?.artwork).not.toBeDefined()
    expect(navigator.mediaSession.metadata?.title).not.toBeDefined()
    expect(navigator.mediaSession.setPositionState).toHaveBeenCalledWith()
    expect(navigator.mediaSession.playbackState).toBe<MediaSessionPlaybackState>('none')
    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', null)
  })
})
