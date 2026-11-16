import type { UseMediaSessionOptions } from './index'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { computed, ref as deepRef, nextTick, shallowRef } from 'vue'
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

function createState() {
  return {
    album: shallowRef<string>(),
    artist: shallowRef<string>(),
    artwork: shallowRef<MediaImage[]>(),
    title: shallowRef<string>(),
    duration: shallowRef<number>(),
    playbackRate: shallowRef<number>(),
    position: shallowRef<number>(),
    playbackState: shallowRef<MediaSessionPlaybackState>('none'),
    cameraActive: shallowRef(false),
    microphoneActive: shallowRef(false),
  }
}

type MediaSessionTestState = ReturnType<typeof createState>

/**
 * Passes a ref for every state option, unless the test passes its own options.
 */
function setupMediaSession(
  navigator: Navigator,
  initialize?: (state: MediaSessionTestState) => void,
  options: Omit<UseMediaSessionOptions, 'navigator'> = {},
) {
  const state = createState()
  const vm = useSetup(() => {
    const api = useMediaSession({ ...state, ...options, navigator })
    initialize?.(state)
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
  return { api: vm.api, state, unmount }
}

describe('useMediaSession', () => {
  it('should not be supported if `navigator.mediaSession` is not available', () => {
    const { isSupported } = setupMediaSession({} as Navigator).api
    expect(isSupported.value).toBe(false)
  })

  it('should initialize the session during setup without waiting for mount', () => {
    const navigator = createMockNavigator()
    navigator.mediaSession.metadata = new MediaMetadata({ title: 'Previous track' })
    navigator.mediaSession.playbackState = 'playing'

    setupMediaSession(navigator, () => {
      expect(navigator.mediaSession.metadata).toBeNull()
      expect(navigator.mediaSession.playbackState).toBe('none')
      expect(navigator.mediaSession.setPositionState).toHaveBeenCalledExactlyOnceWith()
      expect(navigator.mediaSession.setCameraActive).toHaveBeenCalledExactlyOnceWith(false)
      expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenCalledExactlyOnceWith(false)
    })
  })

  it('should update MediaSession `metadata` on states update', async () => {
    const navigator = createMockNavigator()
    const { album, artist, artwork, title } = setupMediaSession(navigator).state

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
    const { playbackState } = setupMediaSession(navigator).state

    playbackState.value = 'playing'

    await nextTick()

    expect(navigator.mediaSession.playbackState).toBe<MediaSessionPlaybackState>('playing')
  })

  it.each([
    { state: 'duration', value: 180 },
    { state: 'playbackRate', value: 2 },
    { state: 'position', value: 100 },
  ] as const)('should update position state when `$state` changes', async ({ state, value }) => {
    const navigator = createMockNavigator()
    const { state: session } = setupMediaSession(navigator, (session) => {
      session.duration.value = 120
      session.playbackRate.value = 1
      session.position.value = 10
    })
    const setPositionState = vi.mocked(navigator.mediaSession.setPositionState)
    setPositionState.mockClear()

    session[state].value = value
    await nextTick()

    expect(setPositionState).toHaveBeenCalledExactlyOnceWith({
      duration: 120,
      playbackRate: 1,
      position: 10,
      [state]: value,
    })
  })

  it('should wait for duration before publishing native position state', async () => {
    const navigator = createMockNavigator()
    const setPositionState = vi.mocked(navigator.mediaSession.setPositionState)
    setPositionState.mockImplementation(state => window.navigator.mediaSession.setPositionState(state))
    const { duration, playbackRate, position } = setupMediaSession(navigator).state
    setPositionState.mockClear()

    playbackRate.value = 2
    position.value = 10
    await nextTick()
    expect(setPositionState).not.toHaveBeenCalled()

    duration.value = 120
    await nextTick()
    expect(setPositionState).toHaveBeenLastCalledWith({ duration: 120, playbackRate: 2, position: 10 })

    duration.value = undefined
    await nextTick()
    expect(setPositionState).toHaveBeenLastCalledWith()
  })

  it('should accept a zero duration', async () => {
    const navigator = createMockNavigator()
    const setPositionState = vi.mocked(navigator.mediaSession.setPositionState)
    setPositionState.mockImplementation(state => window.navigator.mediaSession.setPositionState(state))
    const { duration } = setupMediaSession(navigator).state

    duration.value = 0
    await nextTick()

    expect(setPositionState).toHaveBeenLastCalledWith({
      duration: 0,
      playbackRate: undefined,
      position: undefined,
    })
  })

  it('should register handlers from `on*` options during setup', () => {
    const navigator = createMockNavigator()
    const play = vi.fn()
    const seekto = vi.fn()
    setupMediaSession(navigator, undefined, { onPlay: play, onSeekTo: seekto })

    const setActionHandler = vi.mocked(navigator.mediaSession.setActionHandler)
    expect(setActionHandler).toHaveBeenCalledTimes(2)
    expect(setActionHandler).toHaveBeenCalledWith('play', play)
    expect(setActionHandler).toHaveBeenCalledWith('seekto', seekto)
  })

  it('should not register any handlers without `on*` options', () => {
    const navigator = createMockNavigator()
    setupMediaSession(navigator)

    expect(navigator.mediaSession.setActionHandler).not.toHaveBeenCalled()
  })

  it('should map every `on*` option to its action', () => {
    const navigator = createMockNavigator()
    const handlers = {
      onPlay: vi.fn(),
      onPause: vi.fn(),
      onStop: vi.fn(),
      onSeekBackward: vi.fn(),
      onSeekForward: vi.fn(),
      onSeekTo: vi.fn(),
      onPreviousTrack: vi.fn(),
      onNextTrack: vi.fn(),
      onSkipAd: vi.fn(),
    }
    setupMediaSession(navigator, undefined, handlers)

    const setActionHandler = vi.mocked(navigator.mediaSession.setActionHandler)
    expect(setActionHandler).toHaveBeenCalledWith('play', handlers.onPlay)
    expect(setActionHandler).toHaveBeenCalledWith('pause', handlers.onPause)
    expect(setActionHandler).toHaveBeenCalledWith('stop', handlers.onStop)
    expect(setActionHandler).toHaveBeenCalledWith('seekbackward', handlers.onSeekBackward)
    expect(setActionHandler).toHaveBeenCalledWith('seekforward', handlers.onSeekForward)
    expect(setActionHandler).toHaveBeenCalledWith('seekto', handlers.onSeekTo)
    expect(setActionHandler).toHaveBeenCalledWith('previoustrack', handlers.onPreviousTrack)
    expect(setActionHandler).toHaveBeenCalledWith('nexttrack', handlers.onNextTrack)
    expect(setActionHandler).toHaveBeenCalledWith('skipad', handlers.onSkipAd)
  })

  it('should continue registering supported actions when an action is unsupported', () => {
    const navigator = createMockNavigator()
    const play = vi.fn()
    vi.mocked(navigator.mediaSession.setActionHandler).mockImplementation((action) => {
      if (action === 'skipad')
        throw new DOMException('Unsupported action', 'NotSupportedError')
    })
    setupMediaSession(navigator, undefined, { onSkipAd: vi.fn(), onPlay: play })

    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', play)
  })

  it('should unregister handlers on unmount', () => {
    const navigator = createMockNavigator()
    const vm = setupMediaSession(navigator, undefined, { onPlay: vi.fn(), onPause: vi.fn() })
    const setActionHandler = vi.mocked(navigator.mediaSession.setActionHandler)
    setActionHandler.mockClear()

    vm.unmount()
    expect(setActionHandler).toHaveBeenCalledTimes(2)
    expect(setActionHandler).toHaveBeenCalledWith('play', null)
    expect(setActionHandler).toHaveBeenCalledWith('pause', null)
  })

  it('should not unregister actions that failed to register', () => {
    const navigator = createMockNavigator()
    const setActionHandler = vi.mocked(navigator.mediaSession.setActionHandler)
    setActionHandler.mockImplementation((action) => {
      if (action === 'skipad')
        throw new DOMException('Unsupported action', 'NotSupportedError')
    })
    const vm = setupMediaSession(navigator, undefined, { onSkipAd: vi.fn(), onPlay: vi.fn() })
    setActionHandler.mockClear()

    vm.unmount()

    expect(setActionHandler).toHaveBeenCalledExactlyOnceWith('play', null)
  })

  it.each([
    { camera: false, microphone: false },
    { camera: true, microphone: false },
    { camera: false, microphone: true },
    { camera: true, microphone: true },
  ])('should handle camera=$camera and microphone=$microphone support', async ({ camera, microphone }) => {
    const navigator = createMockNavigator(camera, microphone)
    const { api, state } = setupMediaSession(navigator)
    const { isSetCameraSupported, isSetMicrophoneSupported } = api
    const { cameraActive, microphoneActive } = state

    expect(isSetCameraSupported.value).toBe(camera)
    expect(isSetMicrophoneSupported.value).toBe(microphone)

    cameraActive.value = true
    microphoneActive.value = true
    await nextTick()

    if (camera)
      expect(navigator.mediaSession.setCameraActive).toHaveBeenLastCalledWith(true)
    if (microphone)
      expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenLastCalledWith(true)
  })

  it('should reset the session on unmount', async () => {
    const navigator = createMockNavigator()

    const vm = setupMediaSession(navigator, (state) => {
      state.album.value = sampleMedia.album
      state.artist.value = sampleMedia.artist
      state.artwork.value = sampleMedia.artwork
      state.title.value = sampleMedia.title

      state.duration.value = 120
      state.playbackRate.value = 2
      state.position.value = 100

      state.playbackState.value = 'playing'
      state.cameraActive.value = true
      state.microphoneActive.value = true
    })

    expect(navigator.mediaSession.metadata?.title).toBe(sampleMedia.title)

    expect(navigator.mediaSession.setCameraActive).toHaveBeenLastCalledWith(true)
    expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenLastCalledWith(true)
    expect(navigator.mediaSession.setPositionState).toHaveBeenLastCalledWith({
      duration: 120,
      playbackRate: 2,
      position: 100,
    })
    vi.mocked(navigator.mediaSession.setPositionState).mockClear()

    vm.unmount()
    await nextTick()

    expect(navigator.mediaSession.metadata).toBeNull()
    expect(navigator.mediaSession.setCameraActive).toHaveBeenLastCalledWith(false)
    expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenLastCalledWith(false)
    expect(navigator.mediaSession.setPositionState).toHaveBeenLastCalledWith()
    expect(navigator.mediaSession.playbackState).toBe<MediaSessionPlaybackState>('none')
  })

  it('should stop synchronizing after unmount', async () => {
    const navigator = createMockNavigator()
    const vm = setupMediaSession(navigator)
    vm.unmount()
    vi.mocked(navigator.mediaSession.setPositionState).mockClear()
    vi.mocked(navigator.mediaSession.setCameraActive).mockClear()
    vi.mocked(navigator.mediaSession.setMicrophoneActive).mockClear()

    vm.state.title.value = 'After unmount'
    vm.state.playbackState.value = 'playing'
    vm.state.duration.value = 120
    vm.state.cameraActive.value = true
    vm.state.microphoneActive.value = true
    await nextTick()

    expect(navigator.mediaSession.metadata).toBeNull()
    expect(navigator.mediaSession.playbackState).toBe('none')
    expect(navigator.mediaSession.setPositionState).not.toHaveBeenCalled()
    expect(navigator.mediaSession.setCameraActive).not.toHaveBeenCalled()
    expect(navigator.mediaSession.setMicrophoneActive).not.toHaveBeenCalled()
  })

  it('should default to an empty session', () => {
    const navigator = createMockNavigator()
    useSetup(() => useMediaSession({ navigator }))

    expect(navigator.mediaSession.metadata).toBeNull()
    expect(navigator.mediaSession.playbackState).toBe('none')
    expect(navigator.mediaSession.setPositionState).toHaveBeenLastCalledWith()
    expect(navigator.mediaSession.setCameraActive).toHaveBeenLastCalledWith(false)
    expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenLastCalledWith(false)
  })

  it('should publish plain values on setup', () => {
    const navigator = createMockNavigator()
    useSetup(() => useMediaSession({
      navigator,
      ...sampleMedia,
      duration: 100,
      playbackRate: 1,
      position: 10,
      playbackState: 'paused',
      cameraActive: true,
      microphoneActive: true,
    }))

    expect(navigator.mediaSession.metadata?.title).toBe(sampleMedia.title)
    expect(navigator.mediaSession.metadata?.album).toBe(sampleMedia.album)
    expect(navigator.mediaSession.playbackState).toBe('paused')
    expect(navigator.mediaSession.setPositionState).toHaveBeenCalledExactlyOnceWith({ duration: 100, playbackRate: 1, position: 10 })
    expect(navigator.mediaSession.setCameraActive).toHaveBeenCalledExactlyOnceWith(true)
    expect(navigator.mediaSession.setMicrophoneActive).toHaveBeenCalledExactlyOnceWith(true)
  })

  it('should follow getters and computed refs', async () => {
    const navigator = createMockNavigator()
    const track = shallowRef({ title: 'First', artist: 'Artist' })
    const playing = shallowRef(false)
    useSetup(() => useMediaSession({
      navigator,
      title: () => track.value.title,
      artist: () => track.value.artist,
      playbackState: computed(() => playing.value ? 'playing' : 'paused'),
    }))

    expect(navigator.mediaSession.metadata?.title).toBe('First')
    expect(navigator.mediaSession.playbackState).toBe('paused')

    track.value = { title: 'Second', artist: 'Artist' }
    playing.value = true
    await nextTick()

    expect(navigator.mediaSession.metadata?.title).toBe('Second')
    expect(navigator.mediaSession.playbackState).toBe('playing')
  })

  it('should track in-place changes of a deep artwork ref', async () => {
    const navigator = createMockNavigator()
    const artwork = deepRef<MediaImage[]>([])
    useSetup(() => useMediaSession({ navigator, title: sampleMedia.title, artwork }))

    artwork.value.push(sampleMedia.artwork[0])
    await nextTick()

    expect(navigator.mediaSession.metadata?.artwork[0].sizes).toBe(sampleMedia.artwork[0].sizes)
  })

  it('should only return support flags', () => {
    const api = setupMediaSession(createMockNavigator()).api

    expect(Object.keys(api).sort()).toEqual(['isSetCameraSupported', 'isSetMicrophoneSupported', 'isSupported'])
  })
})
