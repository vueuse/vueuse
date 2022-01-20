import { readonly, ref, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { MaybeRef } from '@vueuse/shared'
import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'

export interface UseStyleTagOptions extends ConfigurableDocument {
  /**
   * Media query for styles to apply
   */
  media?: string

  /**
   * Load the style immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Manual controls the timing of loading and unloading
   *
   * @default false
   */
  manual?: boolean
}

export type UseStyleTagReturn = {
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
 * @see https://vueuse.org/useStyleTag
 * @param css
 * @param options
 */
export function useStyleTag(
  css: MaybeRef<string>,
  options?: UseStyleTagOptions,
): UseStyleTagReturn

/**
 * Inject <style> element in head.
 *
 * @see https://vueuse.org/useStyleTag
 * @param id
 * @param css
 * @param options
 */
export function useStyleTag(
  id: string,
  css: MaybeRef<string>,
  options?: UseStyleTagOptions,
): UseStyleTagReturn

export function useStyleTag(...args: any[]) {
  let id: string
  let css: Ref<string>

  const options: UseStyleTagOptions = typeof args[args.length - 1] === 'object' ? args.pop() : {}
  const { document = defaultDocument, immediate = true, manual = false } = options

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
    if (!document)
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
    if (!document || !loaded.value)
      return

    stop()
    document.head.removeChild(document.getElementById(id) as HTMLStyleElement)
    loaded.value = false
  }

  if (immediate && !manual)
    load()

  if (!manual)
    tryOnScopeDispose(unload)

  return {
    id,
    css,
    unload,
    load,
    loaded: readonly(loaded),
  }
}
