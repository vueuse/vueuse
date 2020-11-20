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

export interface ConfigurableNavigator {
  /*
   * Specify a custom `document` instance, e.g. working with iframes or in testing environments.
   */
  navigator?: Navigator
}

export interface ConfigurableLocation {
  /*
   * Specify a custom `document` instance, e.g. working with iframes or in testing environments.
   */
  navigator?: Navigator
}

export const defaultWindow = /* #__PURE__ */ isClient ? window : undefined
export const defaultDocument = /* #__PURE__ */ isClient ? window.document : undefined
export const defaultNavigator = /* #__PURE__ */ isClient ? window.navigator : undefined
export const defaultLocation = /* #__PURE__ */ isClient ? window.location : undefined

const defaultDocsWindow = /* #__PURE__ */ isClient ? <{addEventListener: typeof window.addEventListener; removeEventListener: typeof window.removeEventListener}>{ addEventListener: window.addEventListener, removeEventListener: window.removeEventListener } : undefined
if (defaultDocsWindow && window !== window.parent) {
  defaultDocsWindow.addEventListener = (...args: Parameters<typeof window.addEventListener>) => {
    window.addEventListener(...args)
    window.parent.addEventListener(...args)
  }
  defaultDocsWindow.removeEventListener = (...args: Parameters<typeof window.removeEventListener>) => {
    window.removeEventListener(...args)
    window.parent.removeEventListener(...args)
  }
}

export { defaultDocsWindow }
