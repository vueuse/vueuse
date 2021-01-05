import { isString, MaybeRef, tryOnMounted, tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

export interface UseScriptTagOptions extends ConfigurableDocument {
  immediate?: boolean
  async: boolean
  type: string
  crossorigin?: 'anonymous' | 'use-credentials'
  referrerpolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
  nomodule?: boolean
}

/**
 * Async script tag loading.
 *
 * @see   {@link https://vueuse.js.org/useScriptTag}
 * @param src
 */
export function useScriptTag(
  src: MaybeRef<string>,
  onLoaded: Function = () => {},
  {
    immediate = true,
    async = true,
    document = defaultDocument,
    type = 'text/javascript',
  }: UseScriptTagOptions,
) {
  const scriptTag = ref<HTMLScriptElement>()

  /**
   * Load the script specified via `src`.
   *
   * @param waitForScriptLoad Whether if the Promise should resolve once the "load" event is emitted by the <script> attribute, or right after appending it to the DOM.
   * @returns Promise<HTMLScriptElement>
   */
  const load = (waitForScriptLoad = true): Promise<HTMLScriptElement> =>
    new Promise((resolve, reject) => {
      if (!document) {
        reject(new Error('No document found!'))
        return
      }

      let shouldAppend = false

      let el: HTMLScriptElement = <HTMLScriptElement>(
        document.querySelector(`script[src="${src}"]`)
      )

      if (!el) {
        el = document.createElement('script')
        el.type = type
        el.async = async
        el.src = isString(src) ? src : src.value
        shouldAppend = true
      }
      else if (el.hasAttribute('data-loaded')) {
        scriptTag.value = el
        resolve(el)
        return el
      }

      el.addEventListener('error', event => reject)
      el.addEventListener('abort', event => reject)
      el.addEventListener('load', () => {
        el.setAttribute('data-loaded', 'true')
        scriptTag.value = el
        if (onLoaded) onLoaded(el)
        resolve(el)
      })

      if (shouldAppend) el = document.head.appendChild(el)

      if (!waitForScriptLoad) {
        scriptTag.value = el
        resolve(el)
        return el
      }
    })

  /**
   * Unload the script specified by `src`.
   *
   * @returns Promise<boolean>
   */
  const unload = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      if (!document) {
        reject(new Error('No document found!'))
        return
      }

      if (!scriptTag.value) {
        resolve(true)
        return
      }

      document.head.removeChild(scriptTag.value)

      scriptTag.value = undefined

      resolve(true)
    })

  tryOnMounted(async() => {
    if (immediate) await load()
  })

  tryOnUnmounted(async() => {
    await unload()
  })

  return { scriptTag, load, unload }
}
