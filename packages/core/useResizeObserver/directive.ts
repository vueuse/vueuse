import { directiveHooks, shallowEqual } from '@vueuse/shared'
import type { DirectiveHook, ObjectDirective } from 'vue-demi'
import type { ResizeObserverCallback, UseResizeObserverOptions } from '.'
import { useResizeObserver } from '.'

const elements = new WeakMap<HTMLElement, VoidFunction>()

function destroy(elt: HTMLElement) {
  const unobserve = elements.get(elt)

  if (unobserve) {
    unobserve()
    elements.delete(elt)
  }
}

const update: DirectiveHook<
  HTMLElement,
  any,
  ResizeObserverCallback | [ResizeObserverCallback, UseResizeObserverOptions]
> = (elt, { arg: disabled, oldValue, value }) => {
  if (disabled) {
    destroy(elt)
    return
  }

  if (elements.has(elt) && shallowEqual(oldValue, value))
    return
  destroy(elt)

  let callback: ResizeObserverCallback | undefined,
    options: UseResizeObserverOptions | undefined

  if (Array.isArray(value))
    [callback, options] = value
  else callback = value

  if (typeof callback === 'function') {
    const { stop } = useResizeObserver(elt, callback, options)

    elements.set(elt, stop)
  }
}

export const vResizeObserver: ObjectDirective<
  HTMLElement,
  ResizeObserverCallback | [ResizeObserverCallback, UseResizeObserverOptions]
> = {
  [directiveHooks.mounted]: update,
  [directiveHooks.unmounted]: destroy,
  [directiveHooks.updated]: update,
}
