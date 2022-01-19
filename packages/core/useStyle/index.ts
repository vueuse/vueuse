import { isRef, ref, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { MaybeRef } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

interface UseStyleOptions extends ConfigurableWindow {
  media?: string
  autoload?: boolean
}

type UseStyleReturn = {
  id: string
  css: Ref<string>
  load: () => void
  unload: () => void
  loaded: Ref<boolean>
}

let _id = 0

/**
 * Inject <style> element in head.
 *
 * Overload: Omitted id
 *
 * @see https://vueuse.org/useStyle
 * @param css
 * @param options
 */
export function useStyle(
  css: MaybeRef<string>,
  options?: UseStyleOptions,
): UseStyleReturn

/**
 * Inject <style> element in head.
 *
 * @see https://vueuse.org/useStyle
 * @param id
 * @param css
 * @param options
 */
export function useStyle(
  id: string,
  css: MaybeRef<string>,
  options?: UseStyleOptions,
): UseStyleReturn

export function useStyle(...args: any[]): UseStyleReturn {
  let id: string
  let css: MaybeRef<string>

  const options: UseStyleOptions = typeof args[args.length - 1] === 'object' ? args.pop() : {}
  const { window = defaultWindow, autoload = true } = options

  if (args.length === 1) {
    id = `usestyle_${++_id}`
    css = args[0]
  }
  else {
    id = args[0]
    css = args[1]
  }

  let stop = () => {}
  const cssRef = isRef(css) ? css : ref(css)
  const loaded = ref(false)

  const load = () => {
    if (document.getElementById(id))
      throw new Error(`Style element with id "${id}" already exists.`)

    const el = document.createElement('style')
    el.type = 'text/css'
    el.id = id
    document.head.appendChild(el)
    loaded.value = true
    if (options.media)
      el.media = options.media

    stop = watch(
      cssRef,
      (value) => {
        if (el)
          el.innerText = value
      },
      { immediate: true },
    )
  }

  if (window && autoload)
    load()

  const unload = () => {
    stop()
    if (window && loaded.value) {
      loaded.value = false
      document.head.removeChild(document.getElementById(id) as HTMLStyleElement)
    }
  }

  tryOnScopeDispose(unload)

  return {
    id,
    css: cssRef,
    unload,
    load,
    loaded,
  }
}
