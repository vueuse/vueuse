import { readonly, ref, watch } from 'vue-demi'
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
  let css: Ref<string>

  const options: UseStyleOptions = typeof args[args.length - 1] === 'object' ? args.pop() : {}
  const { window = defaultWindow, autoload = true } = options

  if (args.length === 1) {
    id = `usestyle_${++_id}`
    css = ref(args[0])
  }
  else {
    id = args[0]
    css = ref(args[1])
  }

  let stop = () => {}
  const loaded = ref(false)

  const load = () => {
    if (!window)
      return

    const el = (document.getElementById(id) || document.createElement('style')) as HTMLStyleElement
    el.type = 'text/css'
    el.id = id
    if (options.media)
      el.media = options.media
    document.head.appendChild(el)

    if (loaded.value)
      return

    stop = watch(
      css,
      (value) => {
        el.innerText = value
      },
      { immediate: true },
    )

    loaded.value = true
  }

  const unload = () => {
    if (!window || !loaded.value)
      return

    stop()
    document.head.removeChild(document.getElementById(id) as HTMLStyleElement)
    loaded.value = false
  }

  autoload && load()

  tryOnScopeDispose(unload)

  return {
    id,
    css,
    unload,
    load,
    loaded: readonly(loaded),
  }
}
