import type { ComputedRef, WritableComputedRef } from 'vue-demi'
import { computed, shallowReactive } from 'vue-demi'
import type { MaybeRef, Mutable } from '@vueuse/shared'
import { isFunction, isObject, objectOmit, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow, MaybeComputedElementRef, UseAnimateOptions, UseAnimateReturn } from '../index'
import { defaultWindow, useAnimate, useEventListener, useRafFn } from '../index'

export type UseAnimateRefOptions = UseAnimateOptions & ConfigurableWindow

export interface UseAnimateRefReturn extends UseAnimateReturn {
  readonly pending: ComputedRef<boolean>
  readonly playState: ComputedRef<AnimationPlayState>
  readonly replaceState: ComputedRef<AnimationReplaceState>
  startTime: WritableComputedRef<number | null>
  currentTime: WritableComputedRef<CSSNumberish | null>
  timeline: WritableComputedRef<AnimationTimeline | null>
  playbackRate: WritableComputedRef<number>
  isReverse: ComputedRef<boolean | null>
  progress: WritableComputedRef<number>
}

type AnimateStoreKeys = Extract<keyof Animation, 'startTime' | 'currentTime' | 'timeline' | 'playbackRate' | 'pending' | 'playState' | 'replaceState'>

type AnimateSrote = Mutable<Pick<Animation, AnimateStoreKeys>>

export function useAnimateRef(
  target: MaybeComputedElementRef,
  keyframes: MaybeRef<Keyframe[] | PropertyIndexedKeyframes | null>,
  options?: number | UseAnimateRefOptions,
): UseAnimateRefReturn {
  let config: undefined | UseAnimateRefOptions
  let animateOptions: UseAnimateOptions

  if (isObject(options)) {
    config = options
    animateOptions = objectOmit(options, ['window'])
  }
  else {
    animateOptions = {
      duration: options,
    }
  }

  const {
    immediate = true,
    window = defaultWindow,
    onReady,
    delay,
  } = config || {}
  const { duration } = animateOptions

  animateOptions.onReady = (animate) => {
    useEventListener(animate, 'cancel', syncPause)
    useEventListener(animate, 'finish', syncPause)
    useEventListener(animate, 'remove', syncPause)
    isFunction(onReady) && onReady(animate)
    animate.playState === 'running' && immediate && syncResume()
  }

  const {
    isSupported,
    animate,
    play: _play,
    pause: _pause,
    reverse: _reverse,
    finish: _finish,
    cancel: _cancel,
  } = useAnimate(target, keyframes, animateOptions)

  const store = shallowReactive<AnimateSrote>({
    startTime: null,
    currentTime: null,
    timeline: null,
    playbackRate: 1,
    pending: false,
    playState: 'idle',
    replaceState: 'active',
  })

  const pending = computed(() => store.pending)
  const playState = computed(() => store.playState)
  const replaceState = computed(() => store.replaceState)

  const startTime = computed({
    get() {
      return store.startTime
    },
    set(value) {
      store.startTime = value
      if (animate.value)
        animate.value.startTime = value
    },
  })

  const currentTime = computed({
    get() {
      return store.currentTime
    },
    set(value) {
      store.currentTime = value
      if (animate.value) {
        animate.value.currentTime = value
        syncResume()
      }
    },
  })

  const timeline = computed({
    get() {
      return store.timeline
    },
    set(value) {
      store.timeline = value
      if (animate.value)
        animate.value.timeline = value
    },
  })

  const playbackRate = computed({
    get() {
      return store.playbackRate
    },
    set(value) {
      store.playbackRate = value
      if (animate.value)
        animate.value.playbackRate = value
    },
  })

  const isReverse = computed(() => {
    if (store.playbackRate > 0)
      return true
    else if (store.playbackRate < 0)
      return false
    else
      return null
  })

  const progress = computed({
    get() {
      if (duration && isReverse.value !== null) {
        const progress = (store.currentTime || 0) / (+duration + (delay || 0))

        return isReverse.value ? progress : 1 - progress
      }
      else {
        return 0
      }
    },
    set(value) {
      if (duration && isReverse.value !== null) {
        const total = +duration + (delay || 0)
        const progress = +value * total

        currentTime.value = isReverse.value ? progress : (total - progress)
      }
      else {
        currentTime.value = 0
      }
    },
  })

  const play = () => {
    _play()
    animate.value && syncResume()
  }

  const pause = () => {
    _pause()
    syncPause()
  }

  const reverse = () => {
    _reverse()
    syncResume()
  }

  const finish = () => {
    _finish()
    animate.value?.playbackRate && syncPause()
  }

  const cancel = () => {
    _cancel()
    syncPause()
    store.startTime = null
    store.currentTime = null
  }

  tryOnScopeDispose(syncPause)

  const { resume: resumeRef, pause: pauseRef } = useRafFn(() => {
    if (!animate.value)
      return

    store.pending = animate.value.pending
    store.playState = animate.value.playState
    store.replaceState = animate.value.replaceState
    store.startTime = animate.value.startTime
    store.currentTime = animate.value.currentTime
    store.timeline = animate.value.timeline
    store.playbackRate = animate.value.playbackRate
  }, { immediate: false })

  function syncResume() {
    isSupported.value && store.playbackRate && resumeRef()
  }

  function syncPause() {
    isSupported.value && window && window.requestAnimationFrame(pauseRef)
  }

  return {
    isSupported,
    animate,
    play,
    pause,
    reverse,
    finish,
    cancel,
    pending,
    playState,
    replaceState,
    startTime,
    currentTime,
    timeline,
    playbackRate,
    isReverse,
    progress,
  }
}
