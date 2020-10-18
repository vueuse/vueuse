import { ref, getCurrentInstance, watchEffect } from 'vue-demi'
import Cookie from 'universal-cookie'
import type { IncomingMessage } from 'http'

type RawCookies = {
  [name: string]: string
}

let universalCookie: Cookie | undefined

/**
 * Initializing universal-cookie using request (default is window.document.cookie)
 * @param {Object} req - incoming http request (for SSR)
 * @see {@link https://github.com/reactivestack/cookies/tree/master/packages/universal-cookie|universal-cookie}
 */
export const createCookies = (req?: IncomingMessage) => {
  universalCookie = new Cookie(req ? req.headers.cookie : null)

  return universalCookie
}

/**
 * Reactive methods to work with cookies (firstly call {@link createCookies} method if using SSR)
 * @param {string[]|null|undefined} dependencies - array of watching cookie's names. Pass empty array if don't want to watch cookies changes.
 * @param {boolean} [doNotParse=false] - don't try parse value as JSON
 */
export const useCookies = (dependencies?: string[] | null, doNotParse = false) => {
  const cookies = universalCookie || createCookies()

  let previousCookies = cookies.getAll<RawCookies>({ doNotParse: true })

  /**
   * Adds reactivity to returning methods
   */
  const touches = ref(0)

  /**
   * Calls inside setup() function only
   */
  if (getCurrentInstance()) {
    const onChange = () => {
      const newCookies = cookies.getAll({ doNotParse: true })

      if (
        shouldUpdate(
          dependencies || null,
          newCookies,
          previousCookies,
        )
      )
        touches.value++

      previousCookies = newCookies
    }

    watchEffect(() => {
      cookies.addChangeListener(onChange)

      return () => {
        cookies.removeChangeListener(onChange)
      }
    })
  }

  return {
    /**
     * Reactive get cookie by name
     */
    get: <T = any>(...args: Parameters<Cookie['get']>) => {
      // eslint-disable-next-line no-unused-expressions
      touches.value // adds reactivity to method
      return cookies.get<T>(args[0], { doNotParse, ...args[1] })
    },
    /**
     * Reactive get all cookies
     */
    getAll: <T = any>(...args: Parameters<Cookie['getAll']>) => {
      // eslint-disable-next-line no-unused-expressions
      touches.value // adds reactivity to method
      return cookies.getAll<T>({ doNotParse, ...args[0] })
    },
    set: (...args: Parameters<Cookie['set']>) => cookies.set(...args),
    remove: (...args: Parameters<Cookie['remove']>) => cookies.remove(...args),
    addChangeListener: (...args: Parameters<Cookie['addChangeListener']>) => cookies.addChangeListener(...args),
    removeChangeListener: (...args: Parameters<Cookie['removeChangeListener']>) => cookies.removeChangeListener(...args),
  }
}

const shouldUpdate = (
  dependencies: string[] | null,
  newCookies: RawCookies,
  oldCookies: RawCookies,
) => {
  if (!dependencies)
    return true

  for (const dependency of dependencies) {
    if (newCookies[dependency] !== oldCookies[dependency])
      return true
  }

  return false
}
