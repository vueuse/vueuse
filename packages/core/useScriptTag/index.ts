import { isString, MaybeRef, tryOnMounted, tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

export interface UseScriptTagOptions extends ConfigurableDocument {
  immediate?: boolean
  async?: boolean
  type?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
  noModule?: boolean
  defer?: boolean
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
    crossOrigin,
    referrerPolicy,
    noModule,
    defer,
  }: UseScriptTagOptions = {},
) {
  const scriptTag = ref<HTMLScriptElement | null>(null)

  let loadingPromise: Promise<HTMLScriptElement | boolean> | null = null

  /**
   * Load the script specified via `src`.
   *
   * @param waitForScriptLoad Whether if the Promise should resolve once the "load" event is emitted by the <script> attribute, or right after appending it to the DOM.
   * @returns Promise<HTMLScriptElement>
   */
  const loadScript = (waitForScriptLoad: boolean): Promise<HTMLScriptElement | boolean> => new Promise((resolve, reject) => {
    // Some little closure for resolving the Promise.
    const resolveWithElement = (el: HTMLScriptElement) => {
      scriptTag.value = el
      resolve(el)
      return el
    }

    // Check if document actually exists, otherwise resolve the Promise (SSR Support).
    if (!document) {
      resolve(false)
      return
    }

    // Local variable defining if the <script> tag should be appended or not.
    let shouldAppend = false

    let el: HTMLScriptElement = <HTMLScriptElement>(
      document.querySelector(`script[src="${src}"]`)
    )

    // Script tag found, preparing the element for appending
    if (!el) {
      // Create element and set required attributes
      el = document.createElement('script')
      el.type = type
      el.async = async
      el.src = unref(src)
      // Optional attributes
      if (defer) el.defer = defer
      if (crossOrigin) el.crossOrigin = crossOrigin
      if (noModule) el.noModule = noModule
      if (referrerPolicy) el.referrerPolicy = referrerPolicy
      // Enables shouldAppend
      shouldAppend = true
    }
    // Script tag already exists, resolve the loading Promise with it.
    else if (el.hasAttribute('data-loaded')) {
      resolveWithElement(el)
    }

    // Event listeners
    el.addEventListener('error', event => reject(event))
    el.addEventListener('abort', event => reject(event))
    el.addEventListener('load', () => {
      el.setAttribute('data-loaded', 'true')

      onLoaded(el)

      resolveWithElement(el)
    })

    // Append the <script> tag to head.
    if (shouldAppend) el = document.head.appendChild(el)

    // If script load awaiting isn't needed, we can resolve the Promise.
    if (!waitForScriptLoad) resolveWithElement(el)
  })

  /**
   * Exposed singleton wrapper for `loadScript`, avoiding calling it twice.
   *
   * @param waitForScriptLoad Whether if the Promise should resolve once the "load" event is emitted by the <script> attribute, or right after appending it to the DOM.
   * @returns Promise<HTMLScriptElement>
   */
  const load = (waitForScriptLoad = true): Promise<HTMLScriptElement|boolean> => {
    if (loadingPromise) return loadingPromise

    loadingPromise = loadScript(waitForScriptLoad)

    return loadingPromise
  }

  /**
   * Unload the script specified by `src`.
   *
   * @returns Promise<boolean>
   */
  const unload = (): Promise<boolean> =>
    new Promise((resolve) => {
      // Check if document actually exists, otherwise reject the Promise.
      if (!document) {
        resolve(false)
        return
      }

      loadingPromise = null

      // Check if script tag actually exists, otherwise resolve the Promise.
      if (!scriptTag.value) {
        resolve(true)
        return
      }

      // Remove the <script> tag from the document head.
      document.head.removeChild(scriptTag.value)

      // Reset the <script> tag reference.
      scriptTag.value = undefined

      resolve(true)
    })

  // Try to load the script onMounted.
  if (immediate) tryOnMounted(async() => load())

  // Try to unload the script onUnMounted.
  tryOnUnmounted(async() => unload())

  return { scriptTag, load, unload, loadingPromise }
}
