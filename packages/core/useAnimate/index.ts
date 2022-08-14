import { ref, unref, watch } from 'vue-demi'
import { isFunction, isObject, tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import type { MaybeRef } from '@vueuse/shared'
import { unrefElement, useSupported } from '../index'
import type { MaybeComputedElementRef } from '../index'

interface UseAnimateOptions extends KeyframeAnimationOptions {
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

export function useAnimate(
  target: MaybeComputedElementRef,
  keyframes: MaybeRef<Keyframe[] | PropertyIndexedKeyframes | null>,
  options?: number | UseAnimateOptions,
) {
  let config: undefined | UseAnimateOptions
  let animateOptions: undefined | number | KeyframeAnimationOptions

  if (isObject(options)) {
    config = options
    animateOptions = options // objectOmit TODO:
  }
  else {
    animateOptions = options
  }

  const { immediate = true, commitStyles, persist, onReady } = config || {}

  const isSupported = useSupported(() => {
    return HTMLElement && 'animate' in HTMLElement.prototype
  })

  const animate = ref<Animation | undefined>(undefined)
  const playbackRate = ref(1)

  const update = () => {
    const el = unrefElement(target)
    if (!isSupported.value || !el)
      return

    animate.value = el.animate(unref(keyframes), animateOptions)

    commitStyles && animate.value.commitStyles()
    persist && animate.value.persist()
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

  const cancel = () => {
    animate.value?.cancel()
  }

  const finish = () => {
    animate.value?.finish()
  }

  watch(() => target, (el) => {
    unref(el) && update()
  })

  watch(() => keyframes, (value) => {
    !animate.value && update()

    if (animate.value) {
      animate.value.effect = new KeyframeEffect(
        unrefElement(target)!,
        unref(value),
        animateOptions,
      )
    }
  }, { deep: true })

  watch(playbackRate, (value) => {
    !animate.value && update()

    if (animate.value)
      animate.value.playbackRate = value
  })

  immediate && tryOnMounted(update)

  animate.value && tryOnScopeDispose(cancel)

  return {
    isSupported,
    animate,
    playbackRate,
    play,
    pause,
    reverse,
    cancel,
    finish,
  }
}
