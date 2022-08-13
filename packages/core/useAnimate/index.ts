import { ref, unref, watch } from 'vue-demi'
import { isObject, tryOnMounted } from '@vueuse/shared'
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
  commitStyles?: boolean
  persist?: boolean
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

  const { immediate = true, commitStyles, persist } = config || {}

  const isSupported = useSupported(() => {
    return HTMLElement && 'animate' in HTMLElement.prototype
  })

  const animate = ref<Animation | null>()
  const playbackRate = ref(1)

  const update = () => {
    const el = unrefElement(target)
    if (!isSupported.value || !el)
      return

    animate.value = el.animate(unref(keyframes), animateOptions)

    commitStyles && animate.value.commitStyles()
    persist && animate.value.persist()
  }

  const play = () => {
    animate.value ? animate.value.play() : update()
  }

  const pause = () => {
    animate.value?.pause()
  }

  const reverse = () => {
    animate.value?.reverse()
  }

  const cancel = () => {
    animate.value?.cancel()
  }

  const finish = () => {
    animate.value?.finish()
  }

  immediate && tryOnMounted(update)

  watch([() => target, () => keyframes], ([el]) => {
    el && update()
  })

  watch(playbackRate, (value) => {
    !animate.value && update()
    animate.value?.updatePlaybackRate(value)
  })

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
