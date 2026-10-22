import type { ConfigurableDocument } from '../_configurable'
import type { MaybeComputedElementRef, MaybeElement } from '../unrefElement'
import { tryOnMounted } from '@vueuse/shared'
import { computed, shallowRef, watch } from 'vue'
import { defaultDocument } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useMutationObserver } from '../useMutationObserver'

export type UseTextDirectionValue = 'ltr' | 'rtl' | 'auto'

export interface UseTextDirectionOptions extends ConfigurableDocument {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string
  /**
   * Observe target attribute changes using MutationObserver
   *
   * @default false
   */
  observe?: boolean
  /**
   * Initial value
   *
   * @default 'ltr'
   */
  initialValue?: UseTextDirectionValue
}

export type UseTextDirectionTargetOptions = Omit<UseTextDirectionOptions, 'document' | 'selector'>

function isTarget(value: UseTextDirectionOptions | MaybeComputedElementRef): value is MaybeComputedElementRef {
  if (value == null || typeof value === 'function')
    return true

  if (typeof value !== 'object')
    return false

  return 'nodeType' in value || '$el' in value || 'value' in value
}

/**
 * Reactive dir of the element's text.
 *
 * Pass an element or Vue component ref to read its computed CSS direction.
 * Without a target, the direction is read from the configured element's dir attribute.
 *
 * @see https://vueuse.org/useTextDirection
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useTextDirection(options?: UseTextDirectionOptions): ReturnType<typeof computed<UseTextDirectionValue>>
export function useTextDirection(target: MaybeComputedElementRef, options?: UseTextDirectionTargetOptions): ReturnType<typeof computed<UseTextDirectionValue>>
export function useTextDirection(
  targetOrOptions: UseTextDirectionOptions | MaybeComputedElementRef = {},
  targetOptions: UseTextDirectionTargetOptions = {},
) {
  const hasTarget = isTarget(targetOrOptions)
  const target = hasTarget ? targetOrOptions as MaybeComputedElementRef : undefined
  const options = hasTarget ? targetOptions : targetOrOptions as UseTextDirectionOptions
  const {
    document = defaultDocument,
    selector = 'html',
    observe = false,
    initialValue = 'ltr',
  } = options

  function getElement(): MaybeElement | Element | null {
    return hasTarget
      ? unrefElement(target!)
      : document?.querySelector(selector) ?? null
  }

  function getValue(): UseTextDirectionValue {
    const element = getElement()

    if (hasTarget) {
      if (!element)
        return initialValue

      const direction = element.ownerDocument.defaultView?.getComputedStyle(element).direction
      return (direction || initialValue) as UseTextDirectionValue
    }

    return (element?.getAttribute('dir') as UseTextDirectionValue) ?? initialValue
  }

  const dir = shallowRef<UseTextDirectionValue>(getValue())

  tryOnMounted(() => dir.value = getValue())

  if (hasTarget) {
    watch(
      () => unrefElement(target!),
      () => dir.value = getValue(),
      { flush: 'post' },
    )
  }

  if (observe && (hasTarget || document)) {
    useMutationObserver(
      hasTarget ? target! : document?.querySelector(selector) as MaybeElement,
      () => dir.value = getValue(),
      { attributes: true },
    )
  }

  return computed<UseTextDirectionValue>({
    get() {
      return dir.value
    },
    set(v) {
      dir.value = v
      const element = getElement()
      if (!element)
        return
      if (dir.value)
        element.setAttribute('dir', dir.value)
      else
        element.removeAttribute('dir')
    },
  })
}
