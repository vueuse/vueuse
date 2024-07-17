import type { Arrayable, Fn, MaybeComputedElementRef } from '@vueuse/core'
import { tryOnScopeDispose, unrefElement } from '@vueuse/core'
import { type MaybeRefOrGetter, notNullish, toValue } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, ref, watch } from 'vue-demi'
import { createFocusTrap } from 'focus-trap'
import type { ActivateOptions, DeactivateOptions, FocusTrap, Options } from 'focus-trap'

export interface UseFocusTrapOptions extends Options {
  /**
   * Immediately activate the trap
   */
  immediate?: boolean
}

export interface UseFocusTrapReturn {
  /**
   * Indicates if the focus trap is currently active
   */
  hasFocus: Ref<boolean>

  /**
   * Indicates if the focus trap is currently paused
   */
  isPaused: Ref<boolean>

  /**
   * Activate the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapactivateactivateoptions
   * @param opts Activate focus trap options
   */
  activate: (opts?: ActivateOptions) => void

  /**
   * Deactivate the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapdeactivatedeactivateoptions
   * @param opts Deactivate focus trap options
   */
  deactivate: (opts?: DeactivateOptions) => void

  /**
   * Pause the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trappause
   */
  pause: Fn

  /**
   * Unpauses the focus trap
   *
   * @see https://github.com/focus-trap/focus-trap#trapunpause
   */
  unpause: Fn
}

/**
 * Reactive focus-trap
 *
 * @see https://vueuse.org/useFocusTrap
 */
export function useFocusTrap(
  target: Arrayable<MaybeRefOrGetter<string> | MaybeComputedElementRef>,
  options: UseFocusTrapOptions = {},
): UseFocusTrapReturn {
  let trap: undefined | FocusTrap

  const { immediate, ...focusTrapOptions } = options
  const hasFocus = ref(false)
  const isPaused = ref(false)

  const activate = (opts?: ActivateOptions) => trap && trap.activate(opts)
  const deactivate = (opts?: DeactivateOptions) => trap && trap.deactivate(opts)

  const pause = () => {
    if (trap) {
      trap.pause()
      isPaused.value = true
    }
  }

  const unpause = () => {
    if (trap) {
      trap.unpause()
      isPaused.value = false
    }
  }

  const targets = computed(() => {
    const _targets = toValue(target)
    return (Array.isArray(_targets) ? _targets : [_targets])
      .map((el) => {
        const _el = toValue(el)
        return typeof _el === 'string' ? _el : unrefElement(_el)
      })
      .filter(notNullish)
  })

  watch(
    targets,
    (els) => {
      if (!els.length)
        return

      trap = createFocusTrap(els, {
        ...focusTrapOptions,
        onActivate() {
          hasFocus.value = true

          // Apply if user provided onActivate option
          if (options.onActivate)
            options.onActivate()
        },
        onDeactivate() {
          hasFocus.value = false

          // Apply if user provided onDeactivate option
          if (options.onDeactivate)
            options.onDeactivate()
        },
      })

      // Focus if immediate is set to true
      if (immediate)
        activate()
    },
    { flush: 'post' },
  )

  // Cleanup on unmount
  tryOnScopeDispose(() => deactivate())

  return {
    hasFocus,
    isPaused,
    activate,
    deactivate,
    pause,
    unpause,
  }
}
