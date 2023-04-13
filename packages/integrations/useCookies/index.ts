import type { IncomingMessage } from 'node:http'
import { tryOnScopeDispose } from '@vueuse/shared'
import { ref } from 'vue-demi'
import Cookie from 'universal-cookie'

type RawCookies = Record<string, string>

/**
 * Creates a new {@link useCookies} function
 * @param {Object} req - incoming http request (for SSR)
 * @see https://github.com/reactivestack/cookies/tree/master/packages/universal-cookie universal-cookie
 * @description Creates universal-cookie instance using request (default is window.document.cookie) and returns {@link useCookies} function with provided universal-cookie instance
 */
export function createCookies(req?: IncomingMessage) {
  const universalCookie = new Cookie(req ? req.headers.cookie : null)

  return (
    dependencies?: string[] | null,
    { doNotParse = false, autoUpdateDependencies = false } = {},
  ) => useCookies(dependencies, { doNotParse, autoUpdateDependencies }, universalCookie)
}

/**
 * Reactive methods to work with cookies (use {@link createCookies} method instead if you are using SSR)
 * @param {string[]|null|undefined} dependencies - array of watching cookie's names. Pass empty array if don't want to watch cookies changes.
 * @param {Object} options
 * @param {boolean} options.doNotParse - don't try parse value as JSON
 * @param {boolean} options.autoUpdateDependencies - automatically update watching dependencies
 * @param {Object} cookies - universal-cookie instance
 */
export function useCookies(
  dependencies?: string[] | null,
  { doNotParse = false, autoUpdateDependencies = false } = {},
  cookies = new Cookie(),
) {
  const watchingDependencies = autoUpdateDependencies ? [...dependencies || []] : dependencies

  let previousCookies = cookies.getAll<RawCookies>({ doNotParse: true })

  /**
   * Adds reactivity to get/getAll methods
   */
  const touches = ref(0)

  const onChange = () => {
    const newCookies = cookies.getAll({ doNotParse: true })

    if (
      shouldUpdate(
        watchingDependencies || null,
        newCookies,
        previousCookies,
      )
    )
      touches.value++

    previousCookies = newCookies
  }

  cookies.addChangeListener(onChange)

  tryOnScopeDispose(() => {
    cookies.removeChangeListener(onChange)
  })

  return {
    /**
     * Reactive get cookie by name. If **autoUpdateDependencies = true** then it will update watching dependencies
     */
    get: <T = any>(...args: Parameters<Cookie['get']>) => {
      /**
       * Auto update watching dependencies if needed
       */
      if (autoUpdateDependencies && watchingDependencies && !watchingDependencies.includes(args[0]))
        watchingDependencies.push(args[0])

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

function shouldUpdate(
  dependencies: string[] | null,
  newCookies: RawCookies,
  oldCookies: RawCookies,
) {
  if (!dependencies)
    return true

  for (const dependency of dependencies) {
    if (newCookies[dependency] !== oldCookies[dependency])
      return true
  }

  return false
}
