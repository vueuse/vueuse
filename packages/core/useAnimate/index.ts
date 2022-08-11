import { ref, unref, watch } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'
import type { MaybeRef } from '@vueuse/shared'
import { useSupported } from '../useSupported'
import { unrefElement } from '../unrefElement'
import type { MaybeComputedElementRef } from '../unrefElement'

export function useAnimate(
  target: MaybeComputedElementRef,
  keyframes: MaybeRef<Keyframe[] | PropertyIndexedKeyframes | null>,
  options?: number | KeyframeAnimationOptions,
) {
  const isSupported = useSupported(() => {
    return HTMLImageElement && 'animate' in HTMLImageElement.prototype
  })

  const animate = ref<Animation | null>()

  const play = () => {
    if (animate.value)
      animate.value.play()
  }

  const pause = () => {
    if (animate.value)
      animate.value.pause()
  }

  const update = () => {
    const el = unrefElement(target)
    if (!el)
      return

    animate.value = el.animate(unref(keyframes), options)
  }

  tryOnMounted(update)

  watch([() => target, () => keyframes], ([el]) => {
    el && update()
  })

  return {
    isSupported,
    animate,
    play,
    pause,
  }
}
