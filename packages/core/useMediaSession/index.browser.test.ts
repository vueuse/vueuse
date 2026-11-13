import type { UseMediaSessionReturn } from './index'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
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
      metadata: null as MediaMetadata | null,
      playbackState: 'none' as MediaSessionPlaybackState,
      setActionHandler: vi.fn(),
      setPositionState: vi.fn(),
      ...withCamera ? { setCameraActive: vi.fn() } : {},
      ...withMicrophone ? { setMicrophoneActive: vi.fn() } : {},
    },
  } as unknown as Navigator
}

function setupMediaSession(navigator: Navigator, initialize?: (api: UseMediaSessionReturn) => void) {
  const vm = useSetup(() => {
    const api = useMediaSession({ navigator })
    initialize?.(api)
    return { api }
  })
  let mounted = true
  function unmount() {
    if (mounted) {
      vm.unmount()
      mounted = false
    }
  }
  onTestFinished(unmount)
  return { api: vm.api, unmount }
}

describe('useMediaSession', () => {
  it('should not be supported if `navigator.mediaSession` is not available', () => {
    const { isSupported } = setupMediaSession({} as Navigator).api
    expect(isSupported.value).toBe(false)
  })

  it('should update MediaSession `metadata` on states update', async () => {
    const navigator = createMockNavigator()
    const { album, artist, artwork, title } = setupMediaSession(navigator).api

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
    const { playbackState } = setupMediaSession(navigator).api

    playbackState.value = 'playing'

    await nextTick()

    expect(navigator.mediaSession.playbackState).toBe<MediaSessionPlaybackState>('playing')
  })

  it('should call `setPositionState` on states update', async () => {
    const navigator = createMockNavigator()
    const { duration, playbackRate, position } = setupMediaSession(navigator).api

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

  it('should register handlers assigned during setup', () => {
    const navigator = createMockNavigator()
    const play = vi.fn()
    setupMediaSession(navigator, (api) => {
      api.actionHandlers.value = { play }
    })

    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledExactlyOnceWith('play', play)
  })

  it('should only update added, changed, and removed handlers', async () => {
    const navigator = createMockNavigator()
    const play = vi.fn()
    const pause = vi.fn()
    const nexttrack = vi.fn()
    const { actionHandlers } = setupMediaSession(navigator, (api) => {
      api.actionHandlers.value = { play, pause, nexttrack }
    }).api
    const setActionHandler = vi.mocked(navigator.mediaSession.setActionHandler)
    setActionHandler.mockClear()

    const newPlay = vi.fn()
    const stop = vi.fn()
    actionHandlers.value = { play: newPlay, nexttrack, stop }
    await nextTick()

    expect(setActionHandler).toHaveBeenCalledTimes(3)
    expect(setActionHandler).toHaveBeenCalledWith('pause', null)
    expect(setActionHandler).toHaveBeenCalledWith('play', newPlay)
    expect(setActionHandler).toHaveBeenCalledWith('stop', stop)
    expect(setActionHandler).not.toHaveBeenCalledWith('nexttrack', expect.anything())
  })

  it('should unregister handlers deleted in place', async () => {
    const navigator = createMockNavigator()
    const play = vi.fn()
    const pause = vi.fn()
    const { actionHandlers } = setupMediaSession(navigator).api
    actionHandlers.value = { play, pause }
    await nextTick()
    const setActionHandler = vi.mocked(navigator.mediaSession.setActionHandler)
    setActionHandler.mockClear()

    delete actionHandlers.value.pause
    await nextTick()

    expect(setActionHandler).toHaveBeenCalledExactlyOnceWith('pause', null)
  })

  it('should unregister handlers when the handler map is unset', async () => {
    const navigator = createMockNavigator()
    const { actionHandlers } = setupMediaSession(navigator, (api) => {
      api.actionHandlers.value = { play: vi.fn() }
    }).api
    const setActionHandler = vi.mocked(navigator.mediaSession.setActionHandler)
    setActionHandler.mockClear()

    actionHandlers.value = undefined
    await nextTick()

    expect(setActionHandler).toHaveBeenCalledExactlyOnceWith('play', null)
  })

  it('should clean up registered handlers before pending updates run', async () => {
    const navigator = createMockNavigator()
    const vm = setupMediaSession(navigator, (api) => {
      api.actionHandlers.value = { play: vi.fn() }
    })
    const setActionHandler = vi.mocked(navigator.mediaSession.setActionHandler)
    expect(setActionHandler).toHaveBeenCalledWith('play', expect.any(Function))
    setActionHandler.mockClear()

    delete vm.api.actionHandlers.value!.play
    vm.unmount()
    await nextTick()

    expect(setActionHandler).toHaveBeenCalledExactlyOnceWith('play', null)
  })

  it('should continue registering supported actions when an action is unsupported', () => {
    const navigator = createMockNavigator()
    const play = vi.fn()
    vi.mocked(navigator.mediaSession.setActionHandler).mockImplementation((action) => {
      if (action === 'skipad')
        throw new DOMException('Unsupported action', 'NotSupportedError')
    })
    setupMediaSession(navigator, (api) => {
      api.actionHandlers.value = { skipad: vi.fn(), play }
    })

    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', play)
  })

  it('should have `isSetCameraSupport` as false if `setCameraActive()` not available', () => {
    const navigator = createMockNavigator(false, false)
    const { isSetCameraSupported } = setupMediaSession(navigator).api

    expect(isSetCameraSupported.value).toBe(false)
  })

  it('should set camera active on states update', async () => {
    const navigator = createMockNavigator()
    const { cameraActive, isSetCameraSupported } = setupMediaSession(navigator).api

    expect(isSetCameraSupported.value).toBe(true)

    cameraActive.value = true

    await nextTick()

    expect(navigator.mediaSession.setCameraActive).toHaveBeenLastCalledWith(true)
  })

  it('should have `isSetMicrophoneSupported` as false if `setMicrophoneActive()` not available', () => {
    const navigator = createMockNavigator(false, false)
    const { isSetMicrophoneSupported } = setupMediaSession(navigator).api

    expect(isSetMicrophoneSupported.value).toBe(false)
  })

  it('should set microphone active on states update', async () => {
    const navigator = createMockNavigator()
    const { microphoneActive, isSetMicrophoneSupported } = setupMediaSession(navigator).api

    expect(isSetMicrophoneSupported.value).toBe(true)

    microphoneActive.value = true

    await nextTick()

    expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenLastCalledWith(true)
  })

  it.each(['clear', 'unmount'] as const)('should reset the session on %s', async (operation) => {
    const navigator = createMockNavigator()

    const vm = setupMediaSession(navigator, (api) => {
      api.album.value = sampleMedia.album
      api.artist.value = sampleMedia.artist
      api.artwork.value = sampleMedia.artwork
      api.title.value = sampleMedia.title

      api.duration.value = 120
      api.playbackRate.value = 2
      api.position.value = 100

      api.playbackState.value = 'playing'
      api.cameraActive.value = true
      api.microphoneActive.value = true
      api.actionHandlers.value = {
        play: () => api.playbackState.value = 'playing',
      }
    })

    expect(navigator.mediaSession.metadata?.title).toBe(sampleMedia.title)
    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', expect.any(Function))

    expect(navigator.mediaSession.setCameraActive).toHaveBeenLastCalledWith(true)
    expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenLastCalledWith(true)

    if (operation === 'clear')
      vm.api.clear()
    else
      vm.unmount()
    await nextTick()

    expect(navigator.mediaSession.metadata).toBeNull()
    expect(vm.api.cameraActive.value).toBe(false)
    expect(vm.api.microphoneActive.value).toBe(false)
    expect(navigator.mediaSession.setCameraActive).toHaveBeenLastCalledWith(false)
    expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenLastCalledWith(false)
    expect(navigator.mediaSession.setPositionState).toHaveBeenCalledWith()
    expect(navigator.mediaSession.playbackState).toBe<MediaSessionPlaybackState>('none')
    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', null)
  })

  it('should allow publishing a new session after clearing', async () => {
    const navigator = createMockNavigator()
    const api = setupMediaSession(navigator, (api) => {
      api.title.value = 'First track'
      api.actionHandlers.value = { play: vi.fn() }
    }).api
    api.clear()
    await nextTick()
    expect(navigator.mediaSession.metadata).toBeNull()

    const play = vi.fn()
    api.title.value = 'Next track'
    api.actionHandlers.value = { play }
    await nextTick()

    expect(navigator.mediaSession.metadata?.title).toBe('Next track')
    expect(navigator.mediaSession.setActionHandler).toHaveBeenLastCalledWith('play', play)
  })
})
