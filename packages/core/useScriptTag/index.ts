import { isFunction, isString, MaybeRef, tryOnMounted, tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

export interface UseScriptTagOptions {
  loadOnMounted?: boolean
}

/**
 * Async script tag loading.
 *
 * @see   {@link https://vueuse.js.org/useScriptTag}
 * @param src
 */
export function useScriptTag(
  src: MaybeRef<string>,
  onLoaded: Function,
  {
    loadOnMounted = true,
  }: UseScriptTagOptions = {},
  {
    document = defaultDocument,
  }: ConfigurableDocument = {},
) {
  const scriptTag = ref<HTMLScriptElement | null>()

  /**
   * Load the script specified via `src`.
   */
  const loadScript = (): Promise<HTMLScriptElement> => new Promise(
    (resolve, reject) => {
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
        return scriptTag.value
      }

      el.addEventListener('error', () => reject(new Error('Error while loading script!')))
      el.addEventListener('abort', () => reject(new Error('Script load aborted!')))
      el.addEventListener('load', () => {
        if (el) {
          el.setAttribute('data-loaded', 'true')
          resolve(el)
        }
      })

      if (shouldAppend) {
        scriptTag.value = document.head.appendChild(el)
        return scriptTag.value
      }
    },
  )

  /**
   * Unload the script specified by `src`.
   */
  const unloadScript = (): Promise<boolean> => new Promise((resolve, reject) => {
    if (!document) {
      reject(new Error('No document found!'))
      return
    }

    if (!src) {
      reject(new Error('No src found!'))
      return
    }

    const el: HTMLScriptElement | null | undefined = scriptTag.value

    if (!el) return

    document.head.removeChild(el)

    resolve(true)
  })

  tryOnMounted(async() => {
    if (loadOnMounted) {
      const el = await loadScript()

      if (onLoaded && isFunction(onLoaded)) onLoaded(el)
    }
  })

  tryOnUnmounted(async() => {
    await unloadScript()
  })

  return [scriptTag, loadScript, unloadScript]
}
