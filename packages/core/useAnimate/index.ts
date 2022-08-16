import type { Ref, ShallowRef } from 'vue-demi'
import { shallowRef, unref, watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { isFunction, isObject, objectOmit, tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import type { MaybeComputedElementRef } from '../index'
import { unrefElement, useSupported } from '../index'

export interface UseAnimateOptions extends KeyframeAnimationOptions {
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
  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void
}

export interface UseAnimateReturn {
  isSupported: Ref<boolean>
  animate: ShallowRef<Animation | undefined>
  play: () => void
  pause: () => void
  reverse: () => void
  finish: () => void
  cancel: () => void
}

export function useAnimate(
  target: MaybeComputedElementRef,
  keyframes: MaybeRef<Keyframe[] | PropertyIndexedKeyframes | null>,
  options?: number | UseAnimateOptions,
): UseAnimateReturn {
  let config: undefined | UseAnimateOptions
  let animateOptions: undefined | number | KeyframeAnimationOptions

  if (isObject(options)) {
    config = options
    animateOptions = objectOmit(options, ['immediate', 'commitStyles', 'persist', 'onReady', 'onError'])
  }
  else {
    animateOptions = options
  }

  const {
    immediate = true,
    commitStyles,
    persist,
    onReady,
    onError = (e: unknown) => {
      console.error(e)
    },
  } = config || {}

  const isSupported = useSupported(() => {
    return HTMLElement && 'animate' in HTMLElement.prototype
  })

  const animate = shallowRef<Animation | undefined>(undefined)

  const update = (init?: boolean) => {
    const el = unrefElement(target)
    if (!isSupported.value || !el)
      return

    animate.value = el.animate(unref(keyframes), animateOptions)

    commitStyles && animate.value.commitStyles()
    persist && animate.value.persist()
    init && !immediate && animate.value.pause()
    isFunction(onReady) && onReady(animate.value)
  }

  const play = () => {
    if (animate.value) {
      try {
        animate.value.play()
      }
      catch (e) {
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
    }
    catch (e) {
      onError(e)
    }
  }

  const reverse = () => {
    !animate.value && update()
    try {
      animate.value?.reverse()
    }
    catch (e) {
      onError(e)
    }
  }

  const finish = () => {
    try {
      animate.value?.finish()
    }
    catch (e) {
      onError(e)
    }
  }

  const cancel = () => {
    try {
      animate.value?.cancel()
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
