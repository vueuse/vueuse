import type { ShallowRef } from 'vue'
import type { MaybeElementRef } from '../unrefElement'
import type { HTMLElementEventName } from '../useEventListener'
import { computed, shallowRef, watch } from 'vue'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

// todo: maybe remove input and foucsin events if feature is stable
export const inputSelectionDefaultEvents: HTMLElementEventName[] = ['selectionchange', 'input', 'focusin']

export interface UseInputSelectionOptions {
  /**
   * Events to trigger the selection tracking.
   *
   * @default ['selectionchange', 'input', 'focusin']
   */
  events?: HTMLElementEventName[]
}

export interface UseInputSelectionReturn<T extends (HTMLInputElement | HTMLTextAreaElement)> {
  start: ShallowRef<T['selectionStart']>
  end: ShallowRef<T['selectionEnd']>
  direction: ShallowRef<T['selectionDirection']>
}

/**
 * Track or set the selection state of a DOM input or textarea element.
 *
 * @param target
 * @param options
 */
export function useInputSelection<T extends (HTMLInputElement | HTMLTextAreaElement)>(target: MaybeElementRef<T | null | undefined>, options: UseInputSelectionOptions = {}): UseInputSelectionReturn<T> {
  const {
    events = inputSelectionDefaultEvents,
  } = options

  const el = computed(() => unrefElement(target))

  const start = shallowRef<T['selectionStart'] | null>(el.value?.selectionStart ?? null)
  const end = shallowRef<T['selectionEnd'] | null>(el.value?.selectionEnd ?? null)
  const direction = shallowRef<T['selectionDirection'] | null>(el.value?.selectionDirection ?? null)

  watch([() => start.value, () => end.value, () => direction.value], ([s, e, d]) => {
    const el = unrefElement(target)
    if (!el)
      return
    el.setSelectionRange(s, e, d)
  }, { flush: 'post' })

  useEventListener(target, events, (e) => {
    const el = e.target as T
    if (start.value !== el.selectionStart)
      start.value = el.selectionStart
    if (end.value !== el.selectionEnd)
      end.value = el.selectionEnd
    if (direction.value !== el.selectionDirection)
      direction.value = el.selectionDirection
  }, { passive: true })

  return {
    start,
    end,
    direction,
  }
}
