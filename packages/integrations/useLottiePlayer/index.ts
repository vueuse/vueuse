import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { AnimationConfigWithData, AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'

/**
 * Wrapper for qrcode.
 *
 * @see https://vueuse.org/useLottiePlayer
 * @param text
 * @param options
 *
 *
 */
// https://assets9.lottiefiles.com/datafiles/MUp3wlMDGtoK5FK/data.json

export function useLottiePlayer(
  lottieData: AnimationConfigWithData,
): Ref<AnimationItem> {
  const anim = ref()
  anim.value = lottie.loadAnimation(lottieData as AnimationConfigWithData)

  return anim
}
