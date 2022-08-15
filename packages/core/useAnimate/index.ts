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
    animateOptions = objectOmit(options, ['immediate', 'commitStyles', 'persist', 'onReady'])
  }
  else {
    animateOptions = options
  }

  const {
    immediate = true,
    commitStyles,
    persist,
    onReady,
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
    animate.value ? animate.value.play() : update()
  }

  const pause = () => {
    animate.value?.pause()
  }

  const reverse = () => {
    !animate.value && update()
    animate.value?.reverse()
  }

  const finish = () => {
    animate.value?.playbackRate && animate.value?.finish()
  }

  const cancel = () => {
    animate.value?.cancel()
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
