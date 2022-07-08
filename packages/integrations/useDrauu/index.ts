import type { Ref } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import type { Brush, Drauu, DrawingMode, Options } from 'drauu'
import { createDrauu } from 'drauu'
import type { EventHookOn, MaybeComputedElementRef } from '@vueuse/core'
import { createEventHook, unrefElement } from '@vueuse/core'
import type { Fn } from '@vueuse/shared'
import { tryOnScopeDispose } from '@vueuse/shared'

export type UseDrauuOptions = Omit<Options, 'el'>

export interface UseDrauuReturn {
  drauuInstance: Ref<Drauu | undefined>
  load: (svg: string) => void
  dump: () => string | undefined
  clear: () => void
  cancel: () => void
  undo: () => boolean | undefined
  redo: () => boolean | undefined
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  brush: Ref<Brush>

  onChanged: EventHookOn
  onCommitted: EventHookOn
  onStart: EventHookOn
  onEnd: EventHookOn
  onCanceled: EventHookOn
}

/**
 * Reactive drauu
 *
 * @see https://vueuse.org/useDrauu
 * @param target The target svg element
 * @param options Drauu Options
 */
export function useDrauu(
  target: MaybeComputedElementRef,
  options?: UseDrauuOptions,
): UseDrauuReturn {
  const drauuInstance = ref<Drauu>()

  let disposables: Fn[] = []

  const onChangedHook = createEventHook<void>()
  const onCanceledHook = createEventHook<void>()
  const onCommittedHook = createEventHook<void>()
  const onStartHook = createEventHook<void>()
  const onEndHook = createEventHook<void>()
  const canUndo = ref(false)
  const canRedo = ref(false)
  const altPressed = ref(false)
  const shiftPressed = ref(false)

  const brush = ref<Brush>({
    color: 'black',
    size: 3,
    arrowEnd: false,
    cornerRadius: 0,
    dasharray: undefined,
    fill: 'transparent',
    mode: 'draw',
  })

  watch(brush, () => {
    const instance = drauuInstance.value

    if (instance) {
      instance.brush = brush.value
      instance.mode = brush.value.mode as DrawingMode
    }
  }, { deep: true })

  const undo = () => drauuInstance.value?.undo()
  const redo = () => drauuInstance.value?.redo()
  const clear = () => drauuInstance.value?.clear()
  const cancel = () => drauuInstance.value?.cancel()
  const load = (svg: string) => drauuInstance.value?.load(svg)
  const dump = () => drauuInstance.value?.dump()

  const cleanup = () => {
    disposables.forEach(dispose => dispose())
    drauuInstance.value?.unmount()
  }

  const syncStatus = () => {
    if (drauuInstance.value) {
      canUndo.value = drauuInstance.value.canUndo()
      canRedo.value = drauuInstance.value.canRedo()
      altPressed.value = drauuInstance.value.altPressed
      shiftPressed.value = drauuInstance.value.shiftPressed
    }
  }

  watch(
    () => unrefElement(target),
    (el) => {
      if (!el || typeof SVGSVGElement === 'undefined' || !(el instanceof SVGSVGElement))
        return

      if (drauuInstance.value)
        cleanup()

      drauuInstance.value = createDrauu({ el, ...options })

      syncStatus()

      disposables = [
        drauuInstance.value.on('canceled', () => onCanceledHook.trigger()),
        drauuInstance.value.on('committed', () => onCommittedHook.trigger()),
        drauuInstance.value.on('start', () => onStartHook.trigger()),
        drauuInstance.value.on('end', () => onEndHook.trigger()),
        drauuInstance.value.on('changed', () => {
          syncStatus()
          onChangedHook.trigger()
        }),
      ]
    }, { flush: 'post' })

  tryOnScopeDispose(() => cleanup())

  return {
    drauuInstance,

    load,
    dump,
    clear,
    cancel,
    undo,
    redo,
    canUndo,
    canRedo,
    brush,

    onChanged: onChangedHook.on,
    onCommitted: onCommittedHook.on,
    onStart: onStartHook.on,
    onEnd: onEndHook.on,
    onCanceled: onCanceledHook.on,
  }
}
