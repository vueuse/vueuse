import { isString, MaybeRef, tryOnMounted, tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

export interface UseScriptTagOptions extends ConfigurableDocument {
  immediate?: boolean
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
    document = defaultDocument,
  }: UseScriptTagOptions = {},
) {
  const scriptTag = ref<HTMLScriptElement>()

  /**
   * Load the script specified via `src`.
   *
   * @param waitForScriptLoad Whether if the Promise should resolve once the "load" event is emitted by the <script> attribute, or right after appending it to the DOM.
   * @returns Promise<HTMLScriptElement>
   */
  const loadScript = (waitForScriptLoad = true): Promise<HTMLScriptElement> =>
    new Promise((resolve, reject) => {
      if (!document) {
        reject(new Error('No document found!'))
        return
      }

      if (!src) {
        reject(new Error('No src found!'))
        return
      }

      let shouldAppend = false

      let el: HTMLScriptElement = <HTMLScriptElement>(
        document.querySelector(`script[src="${src}"]`)
      )

      if (!el) {
        el = document.createElement('script')
        el.type = 'text/javascript'
        el.async = true
        el.src = isString(src) ? src : src.value
        shouldAppend = true
      }
      else if (el.hasAttribute('data-loaded')) {
        scriptTag.value = el
        resolve(el)
        return el
      }

      el.addEventListener('error', () =>
        reject(new Error('Error while loading script!')),
      )
      el.addEventListener('abort', () =>
        reject(new Error('Script load aborted!')),
      )
      el.addEventListener('load', () => {
        if (el) {
          el.setAttribute('data-loaded', 'true')
          scriptTag.value = el
          if (onLoaded) onLoaded(el)
          resolve(el)
        }
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
  const unloadScript = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      if (!document) {
        reject(new Error('No document found!'))
        return
      }

      if (!src) {
        reject(new Error('No src found!'))
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
    if (immediate) await loadScript()
  })

  tryOnUnmounted(async() => {
    await unloadScript()
  })

  return { scriptTag, loadScript, unloadScript } as const
}
