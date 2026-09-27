import type { Fn, Pausable } from '@vueuse/shared'
import { isClient } from '@vueuse/shared'

export interface ConfigurableWindow {
  /*
   * Specify a custom `window` instance, e.g. working with iframes or in testing environments.
   */
  window?: Window
}

export interface ConfigurableDocument {
  /*
   * Specify a custom `document` instance, e.g. working with iframes or in testing environments.
   */
  document?: Document
}

export interface ConfigurableDocumentOrShadowRoot {
  /*
   * Specify a custom `document` instance or a shadow root, e.g. working with iframes or in testing environments.
   */
  document?: DocumentOrShadowRoot
}

export interface ConfigurableNavigator {
  /*
   * Specify a custom `navigator` instance, e.g. working with iframes or in testing environments.
   */
  navigator?: Navigator
}

export interface ConfigurableLocation {
  /*
   * Specify a custom `location` instance, e.g. working with iframes or in testing environments.
   */
  location?: Location
}

export const defaultWindow = isClient ? window : undefined
export const defaultDocument = isClient ? window.document : undefined
export const defaultNavigator = isClient ? window.navigator : undefined
export const defaultLocation = isClient ? window.location : undefined

export interface ConfigurableDeepRefs<D extends boolean> {
  /**
   * Return deep refs instead of shallow refs.
   *
   * @default true - will be changed to `false` by default in the next major
   */
  deepRefs?: D
}

export interface ConfigurableScheduler {
  /**
   * Custom scheduler to use for interval execution.
   */
  scheduler?: (cb: Fn) => Pausable
}
