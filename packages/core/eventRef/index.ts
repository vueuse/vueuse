import { computed, ref, shallowRef, watchEffect } from 'vue-demi'
import { isObject, noop } from '@vueuse/shared'
import type { Ref } from 'vue-demi'

type FnHandler = (...args: any[]) => void

type FnRegister<THandler extends FnHandler> = (
  handler: THandler
) => () => void

type FnGetter<T, THandler extends FnHandler, TArgs extends any[] = Parameters<THandler>> = (
  ...args: Partial<TArgs>
) => T

type FnSetter<T> = (val: T) => void

type FnStopWatch = () => void

interface WritableOptions<T, THandler extends FnHandler> {
  get: FnGetter<T, THandler>
  set: FnSetter<T>
}

interface EventRefProps<T, THandler extends FnHandler> extends EventRefOptions {
  register: FnRegister<THandler>
  get: FnGetter<T, THandler>
}

interface WritableEventRefProps<T, THandler extends FnHandler> extends EventRefOptions {
  register: FnRegister<THandler>
  get: FnGetter<T, THandler>
  set: FnSetter<T>
}

interface EventRefOptions {
  lazy?: boolean
}

export type WritableEventRef<T> = [Ref<T>, FnStopWatch]

export type EventRef<T> = [Ref<T> & { readonly value: T }, FnStopWatch]

export function eventRef<T, THandler extends FnHandler = (() => void)>(
  props: WritableEventRefProps<T, THandler>
): WritableEventRef<T>

export function eventRef<T, THandler extends FnHandler = (() => void)>(
  props: EventRefProps<T, THandler>
): EventRef<T>

export function eventRef<T, THandler extends FnHandler = (() => void)>(
  register: FnRegister<THandler>,
  getter: WritableOptions<T, THandler>,
  options?: EventRefOptions,
): WritableEventRef<T>

export function eventRef<T, THandler extends FnHandler = (() => void)>(
  register: FnRegister<THandler>,
  getter: FnGetter<T, THandler>,
  options?: EventRefOptions,
): EventRef<T>

export function eventRef<T, THandler extends FnHandler =(() => void)>(
  ...args: any
): any {
  let register: FnRegister<THandler>
  let get: FnGetter<T, THandler>
  let set: FnSetter<T>
  let lazy: boolean
  if (isObject(args[0])) {
    const props = args[0] as EventRefProps<T, THandler>
    register = props.register
    get = props.get
    set = (props as WritableEventRefProps<T, THandler>).set ?? noop
    lazy = props.lazy ?? false
  }
  else {
    register = args[0]
    const modify = args[1]
    if (isObject(modify)) {
      get = (modify as WritableOptions<T, THandler>).get
      set = (modify as WritableOptions<T, THandler>).set
    }
    else {
      get = modify
      set = noop
    }
    const options = (args[2] ?? {}) as EventRefOptions
    lazy = options.lazy ?? false
  }

  let cleanup = noop
  let handlerArgs: Partial<Parameters<THandler>> = [] as any
  const started = ref(!lazy)
  const changed = shallowRef<boolean>(false)
  const targetRef = shallowRef<T>(get(...handlerArgs))

  const handler = ((..._args: Parameters<THandler>) => {
    handlerArgs = _args
    changed.value = true
  }) as THandler

  const stopRegisterWatch = watchEffect((onCleanup) => {
    if (!started.value) return

    onCleanup(() => cleanup())

    cleanup()

    const unregister = register(handler)

    cleanup = () => {
      unregister()
      handlerArgs = [] as any
      cleanup = noop
    }

    changed.value = true
  }, { flush: 'pre' })

  const stopGetterWatch = watchEffect(() => {
    changed.value === true && (targetRef.value = get(...handlerArgs))
    changed.value = false
  }, { flush: 'post' })

  const stop = () => {
    stopRegisterWatch()
    stopGetterWatch()
    cleanup()
  }

  return [
    computed({
      get: lazy
        ? () => {
          started.value = true
          return targetRef.value
        }
        : () => targetRef.value,
      set: set ?? noop,
    }),
    stop,
  ]
}
