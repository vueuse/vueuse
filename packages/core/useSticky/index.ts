import { ref, unref } from 'vue-demi'
import { MaybeRef, isClient } from '@vueuse/shared'
import { defaultWindow } from '../_configurable'
import { useScroll } from '../useScroll'

export interface UseStickyOptions {
  scrollTarget?: MaybeRef<HTMLElement | SVGElement | null>
  offsetTop?: number
  offsetBottom?: number
  position?: 'top'|'bottom'
}

/**
 * Make elements remain at the any position you want.
 *
 * @see https://vueuse.org/useSticky
 * @param target
 * @param options
 */
export const useSticky = (ele: MaybeRef<HTMLElement | SVGElement | null>, options: UseStickyOptions = {}) => {
  const isFixed = ref<boolean>(false)
  const width = ref<number>(0)
  const height = ref<number>(0)

  if (!isClient) return { isFixed, width, height }

  const {
    scrollTarget = defaultWindow,
    offsetTop = 0,
    offsetBottom = 0,
    position = 'top',
  } = options

  const offset = position === 'top' ? offsetTop : offsetBottom

  useScroll(scrollTarget, {
    onScroll() {
      const rect = unref(ele)!.getBoundingClientRect()
      width.value = rect.width
      height.value = rect.height

      if (position === 'top') {
        const rectTop = rect.top
        isFixed.value = offset > rectTop
      }
      else {
        const { clientHeight } = document.documentElement
        const rectBottom = rect.bottom
        isFixed.value = clientHeight - offset < rectBottom
      }
    },
  })

  return {
    isFixed,
    width,
    height,
    offset,
  }
}

export type UseStickyReturn = ReturnType<typeof useSticky>
