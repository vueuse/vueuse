import type { ComputedRef, Ref, ShallowRef, WritableComputedRef } from 'vue-demi'
import { computed, shallowReactive, shallowRef, unref, watch } from 'vue-demi'
import type { MaybeRef, Mutable } from '@vueuse/shared'
import { isFunction, isNumber, isObject, objectOmit, tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow, MaybeComputedElementRef } from '../index'
import { unrefElement, useEventListener, useRafFn, useSupported } from '../index'

export interface UseAnimateOptions<Reactive extends boolean> extends KeyframeAnimationOptions, ConfigurableWindow {
  /**
   * Will automatically run play when `useAnimate` is used
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Whether to commits the end styling state of an animation to the element being animated
   *
   * @default false
   */
  commitStyles?: boolean
  /**
   * Whether to persists the animation
   *
   * @default false
   */
  persist?: boolean
  /**
   * Expose more reactive attribute
   *
   * @default false
   */
  reactive?: Reactive
  /**
   * Executed after animation initialization
   */
  onReady?: (animate: Animation) => void
  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void
}

export type UseAnimateKeyframes = MaybeRef<Keyframe[] | PropertyIndexedKeyframes | null>

export interface UseAnimateReturn {
  isSupported: Ref<boolean>
  animate: ShallowRef<Animation | undefined>
  play: () => void
  pause: () => void
  reverse: () => void
  finish: () => void
  cancel: () => void
}

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

export function useAnimate(
  target: MaybeComputedElementRef,
  keyframes: UseAnimateKeyframes,
  options?: number | UseAnimateOptions<false>,
): UseAnimateReturn
export function useAnimate(
  target: MaybeComputedElementRef,
  keyframes: UseAnimateKeyframes,
  options: UseAnimateOptions<true>,
): UseAnimateRefReturn
export function useAnimate(
  target: MaybeComputedElementRef,
  keyframes: UseAnimateKeyframes,
  options?: number | UseAnimateOptions<boolean>,
) {
  let config: undefined | UseAnimateOptions<boolean>
  let animateOptions: undefined | number | KeyframeAnimationOptions

  if (isObject(options)) {
    config = options
    animateOptions = objectOmit(options, ['window', 'immediate', 'commitStyles', 'persist', 'reactive', 'onReady', 'onError'])
  }
  else {
    animateOptions = options
  }

  const {
    immediate = true,
    commitStyles,
    persist,
    reactive,
    duration: _duration,
    delay,
    onReady,
    onError = (e: unknown) => {
      console.error(e)
    },
  } = config || {}
  const duration = _duration ?? (isNumber(animateOptions) ? animateOptions as number : undefined)

  const isSupported = useSupported(() => {
    return HTMLElement && 'animate' in HTMLElement.prototype
  })

  const animate = shallowRef<Animation | undefined>(undefined)

  const update = (init?: boolean) => {
    const el = unrefElement(target)
    if (!isSupported.value || !el)
      return

    animate.value = el.animate(unref(keyframes), animateOptions)

    isFunction(onReady) && onReady(animate.value)
    commitStyles && animate.value.commitStyles()
    persist && animate.value.persist()
    init && !immediate ? animate.value.pause() : syncResume()
    useEventListener(animate, 'cancel', syncPause)
    useEventListener(animate, 'finish', syncPause)
    useEventListener(animate, 'remove', syncPause)
  }

  const store = shallowReactive<AnimateSrote>({
    startTime: null,
    currentTime: null,
    timeline: null,
    playbackRate: 1,
    pending: false,
    playState: immediate ? 'idle' : 'paused',
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
    if (animate.value) {
      try {
        animate.value.play()
        syncResume()
      }
      catch (e) {
        syncPause()
        onError(e)
      }
    }
    else {
      update()
    }
  }

  const pause = () => {
    try {
      animate.value?.pause()
      syncPause()
    }
    catch (e) {
      onError(e)
    }
  }

  const reverse = () => {
    !animate.value && update()
    try {
      animate.value?.reverse()
      syncResume()
    }
    catch (e) {
      syncPause()
      onError(e)
    }
  }

  const finish = () => {
    try {
      animate.value?.finish()
      syncPause()
    }
    catch (e) {
      onError(e)
    }
  }

  const cancel = () => {
    try {
      animate.value?.cancel()
      syncPause()
    }
    catch (e) {
      onError(e)
    }
  }

  watch(() => target, (el) => {
    unref(el) && update()
  })

  watch(() => keyframes, (value) => {
    !animate.value && update()

    if (!unrefElement(target) && animate.value) {
      animate.value.effect = new KeyframeEffect(
        unrefElement(target)!,
        unref(value),
        animateOptions,
      )
    }
  }, { deep: true })

  tryOnMounted(() => {
    update(true)
  })

  tryOnScopeDispose(cancel)

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
    reactive && isSupported.value && resumeRef()
  }

  function syncPause() {
    reactive && isSupported.value && window && window.requestAnimationFrame(pauseRef)
  }

  if (reactive) {
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
  else {
    return {
      isSupported,
      animate,
      play,
      pause,
      reverse,
      finish,
      cancel,
    }
  }
}
