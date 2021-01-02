import { isString, MaybeRef, tryOnMounted } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

/**
 * Async script tag loading.
 *
 * @see   {@link https://vueuse.js.org/useScriptTag}
 * @param src
 */
export function useScriptTag(
  src: MaybeRef<string>,
  { document = defaultDocument }: ConfigurableDocument = {},
) {
  const scriptTag = ref<HTMLScriptElement | null>()

  /**
   * Load the script specified via `src`.
   */
  const loadScript: Promise<HTMLScriptElement> = new Promise(
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
        return
      }

      el.addEventListener('error', () => reject(new Error('Error while loading script!')))
      el.addEventListener('abort', () => reject(new Error('Script load aborted!')))
      el.addEventListener('load', () => {
        if (el) {
          el.setAttribute('data-loaded', 'true')
          resolve(el)
        }
      })

      if (shouldAppend) document.head.appendChild(el)
    },
  )

  /**
   * Unload the script specified by `src`.
   */
  const unloadScript: Promise<boolean> = new Promise((resolve, reject) => {
    if (!document) {
      reject(new Error('No document found!'))
      return
    }

    if (!src) {
      reject(new Error('No src found!'))
      return
    }

    const el: HTMLScriptElement | null | undefined = scriptTag.value

    if (!el) {
      reject(new Error('Script not loaded yet!'))
      return
    }

    document.head.removeChild(el)

    resolve(true)
  })

  tryOnMounted(async() => await loadScript)

  tryOnMounted(async() => await unloadScript)

  return [scriptTag, loadScript, unloadScript]
}
