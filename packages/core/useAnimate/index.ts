import { computed, reactive, ref, unref, watch } from 'vue-demi'
import type { MaybeRef, Mutable } from '@vueuse/shared'
import { isFunction, isNumber, isObject, objectOmit, tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow, MaybeComputedElementRef } from '../index'
import { defaultWindow, unrefElement, useEventListener, useRafFn, useSupported } from '../index'

export interface UseAnimateOptions extends KeyframeAnimationOptions, ConfigurableWindow {
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
   * Executed after animation initialization
   */
  onReady?: (animate: Animation) => void
}

type AnimateStoreKeys = Extract<keyof Animation, 'startTime' | 'currentTime' | 'timeline' | 'playbackRate' | 'pending' | 'playState' | 'replaceState'>

type AnimateSrote = Mutable<Pick<Animation, AnimateStoreKeys>>

export function useAnimate(
  target: MaybeComputedElementRef,
  keyframes: MaybeRef<Keyframe[] | PropertyIndexedKeyframes | null>,
  options?: number | UseAnimateOptions,
) {
  let config: undefined | UseAnimateOptions
  let animateOptions: undefined | number | KeyframeAnimationOptions

  if (isObject(options)) {
    config = options
    animateOptions = objectOmit(options, ['window', 'immediate', 'commitStyles', 'persist', 'onReady'])
  }
  else {
    animateOptions = options
  }

  const {
    immediate = true,
    window = defaultWindow,
    commitStyles,
    persist,
    onReady,

    duration: _duration,
    delay,
  } = config || {}
  const duration = _duration ?? (isNumber(animateOptions) ? animateOptions as number : undefined)

  const isSupported = useSupported(() => {
    return HTMLElement && 'animate' in HTMLElement.prototype
  })

  const animate = ref<Animation | undefined>(undefined)
  const store = reactive<AnimateSrote>({
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
        const progress = ((store.currentTime || 0)) / (+duration + (delay || 0))

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

  const update = (init?: boolean) => {
    const el = unrefElement(target)
    if (!isSupported.value || !el)
      return

    animate.value = el.animate(unref(keyframes), animateOptions)

    if (init && !immediate)
      animate.value.pause()
    else
      syncResume()

    commitStyles && animate.value.commitStyles()
    persist && animate.value.persist()
    isFunction(onReady) && onReady(animate.value)
    useEventListener(animate, 'cancel', syncPause)
    useEventListener(animate, 'finish', syncPause)
    useEventListener(animate, 'remove', syncPause)
  }

  const play = () => {
    if (animate.value) {
      animate.value.play()
      syncResume()
    }
    else {
      update()
    }
  }

  const pause = () => {
    animate.value?.pause()
    syncPause()
  }

  const reverse = () => {
    !animate.value && update()
    animate.value?.reverse()
    syncResume()
  }

  const finish = () => {
    if (store.playbackRate) {
      animate.value?.finish()
      syncPause()
    }
  }

  const cancel = () => {
    animate.value?.cancel()
    syncPause()
    store.startTime = null
    store.currentTime = null
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

  tryOnMounted(update)

  tryOnScopeDispose(cancel)

  const { resume, pause: _pause } = useRafFn(() => {
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
    store.playbackRate && resume()
  }

  function syncPause() {
    if (window)
      window.requestAnimationFrame(_pause)
  }

  return {
    isSupported,
    animate,
    isReverse,
    progress,
    startTime,
    currentTime,
    timeline,
    playbackRate,
    pending,
    playState,
    replaceState,
    play,
    pause,
    reverse,
    finish,
    cancel,
  }
}
