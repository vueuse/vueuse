import { ref, watch } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { MaybeComputedElementRef, MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useResizeObserver } from '../useResizeObserver'
import { type UseIntersectionObserverOptions, useIntersectionObserver } from '../useIntersectionObserver'

export interface UseElementBoundingOptions {
  /**
   * Reset values to 0 on component unmounted
   *
   * @default true
   */
  reset?: boolean

  /**
   * Listen to window resize event
   *
   * @default true
   */
  windowResize?: boolean

  /**
   * Listen to window scroll event
   *
   * @default true
   */
  windowScroll?: boolean

  /**
   * Observe target intersection
   */
  intersectionObserver?: boolean | UseIntersectionObserverOptions

  /**
   * Auto-pause bounding calculations when the target is not intersecting (it requires intersectionObserver to be enabled)
   *
   * @default true
   */
  intersectionAutoPause?: boolean

  /**
   * Immediately call update on component mounted
   *
   * @default true
   */
  immediate?: boolean
}

/**
 * Reactive bounding box of an HTML element.
 *
 * @see https://vueuse.org/useElementBounding
 * @param target
 */
export function useElementBounding(
  target: MaybeComputedElementRef,
  options: UseElementBoundingOptions = {},
) {
  const {
    reset = true,
    windowResize = true,
    windowScroll = true,
    intersectionObserver = false,
    intersectionAutoPause = true,
    immediate = true,
  } = options

  const height = ref(0)
  const bottom = ref(0)
  const left = ref(0)
  const right = ref(0)
  const top = ref(0)
  const width = ref(0)
  const x = ref(0)
  const y = ref(0)
  const visible = ref<boolean | undefined>(undefined)

  function update(force?: boolean) {
    if (!force && intersectionObserver && intersectionAutoPause && !visible.value)
      return

    const el = unrefElement(target)

    if (!el) {
      if (reset) {
        height.value = 0
        bottom.value = 0
        left.value = 0
        right.value = 0
        top.value = 0
        width.value = 0
        x.value = 0
        y.value = 0
      }
      return
    }

    const rect = el.getBoundingClientRect()

    height.value = rect.height
    bottom.value = rect.bottom
    left.value = rect.left
    right.value = rect.right
    top.value = rect.top
    width.value = rect.width
    x.value = rect.x
    y.value = rect.y
  }

  useResizeObserver(target, () => update())
  watch(() => unrefElement(target), ele => !ele && update())

  if (windowScroll)
    useEventListener('scroll', () => update(), { capture: true, passive: true })
  if (windowResize)
    useEventListener('resize', () => update(), { passive: true })
  if (intersectionObserver) {
    useIntersectionObserver(target as MaybeElementRef, ([{ isIntersecting }]) => (visible.value = isIntersecting), {
      threshold: 0,
      ...typeof intersectionObserver === 'boolean'
        ? null
        : intersectionObserver,
    })
  }

  tryOnMounted(() => {
    if (immediate)
      update()
  })

  return {
    height,
    bottom,
    left,
    right,
    top,
    width,
    x,
    y,
    visible,
    update,
  }
}

export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>
