import type { Arrayable } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { GetKeyCode, GetKeyCodeWithModifiers, IncludeElement, KeybindHandlerParams, KeybindNext, KeybindsDef, NormalizeCombinedKeyCode } from './internal'
import { defaultNavigator, defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { buildKeybindTree, createDefaultGetKeyCodeWithModifiers, createDefaultNormalizeCombinedKeyCode, defaultGetKeyCode, defaultIncludeEvent, isMacOS, normalizeKeybindsDef, SEQUENCE_DELAY_MS_DEFAULT } from './internal'

interface UseKeybindsHandlerOptions {
  /**
   * Max delay between key events to consider them as a sequence.
   */
  sequenceDelayMs?: number
  /**
   * Custom implementation for normalizing combined key code.
   *
   * By default this handles meta key mapping.
   * You can define custom behavior.
   * Argument is single combined key code, not whole sequence.
   * Returned value will be compared with `getKeyCodeWithModifiers` value from event.
   */
  normalizeCombinedKeyCode?: NormalizeCombinedKeyCode
  /**
   * Custom implementation for key with modifiers.
   *
   * Default is [alt_][ctrl_][meta_][shift_]<keyCode>.
   * E.g. alt_meta_KeyG
   */
  getKeyCodeWithModifiers?: GetKeyCodeWithModifiers
  /**
   * Custom getter for key code.
   *
   * Will be used only if `getKeyCodeWithModifiers` is not provided.
   * Defaults to `event.code`.
   */
  getKeyCode?: GetKeyCode
  /**
   * Custom filter for events.
   *
   * Defaults to function, that excludes events from input and content editable fields.
   */
  includeEvent?: IncludeElement
  /**
   * Used for testing.
   */
  navigator?: Navigator
}

type KeybindsEventHandler = (e: KeyboardEvent) => void

function useKeybindsEventHandler(
  keybinds: KeybindsDef,
  {
    sequenceDelayMs = SEQUENCE_DELAY_MS_DEFAULT,
    normalizeCombinedKeyCode,
    getKeyCodeWithModifiers: getKeyCodeWithModifiersOption,
    getKeyCode = defaultGetKeyCode,
    includeEvent = defaultIncludeEvent,
    navigator = defaultNavigator,
  }: UseKeybindsHandlerOptions,
): KeybindsEventHandler {
  const macOS = isMacOS(navigator)
  const keybindsNormalized = normalizeKeybindsDef(keybinds, {
    normalizeCombinedKeyCode: normalizeCombinedKeyCode ?? createDefaultNormalizeCombinedKeyCode({ macOS }),
  })
  const keybindTree = buildKeybindTree(keybindsNormalized)
  const getKeyCodeCombined = getKeyCodeWithModifiersOption ?? createDefaultGetKeyCodeWithModifiers({ getKeyCode })

  let keybindState: KeybindNext = keybindTree
  let timeoutRef: ReturnType<typeof setTimeout> | undefined

  const keybindsEventHandler = (e: KeyboardEvent) => {
    const keyCodeCombined = getKeyCodeCombined(e)
    const isIncluded = includeEvent(e)
    const match = isIncluded ? keybindState[keyCodeCombined] : undefined

    if (match) {
      clearTimeout(timeoutRef)
      const handlerParams: KeybindHandlerParams = { lastEvent: e }

      if (match.next) {
        keybindState = match.next

        timeoutRef = setTimeout(() => {
          keybindState = keybindTree
          match.handler?.(handlerParams)
        }, sequenceDelayMs)
      }
      else {
        match.handler?.(handlerParams)
        keybindState = keybindTree
      }
    }
    else {
      keybindState = keybindTree
    }
  }

  return keybindsEventHandler
}

export interface UseKeybindsOptions extends UseKeybindsHandlerOptions {
  target?: MaybeRefOrGetter<Arrayable<EventTarget> | null | undefined>
  event?: MaybeRefOrGetter<Arrayable<'keydown' | 'keypress' | 'keyup'>>
}

export function useKeybinds(
  keybinds: KeybindsDef,
  {
    target = defaultWindow,
    event = 'keydown',
    ...options
  }: UseKeybindsOptions = {},
) {
  const keybindsEventHandler = useKeybindsEventHandler(keybinds, options)
  return useEventListener(target, event, keybindsEventHandler)
}
