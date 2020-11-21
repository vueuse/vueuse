import { isClient, isIframe } from '@vueuse/shared'

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

const defaultDocsWindow = /* #__PURE__ */ isClient ? <Window>{
  addEventListener: (...args: Parameters<Window['addEventListener']>) => {
    window.addEventListener(...args)
    isIframe && window.parent.addEventListener(...args)
  },
  removeEventListener: (...args: Parameters<Window['removeEventListener']>) => {
    window.removeEventListener(...args)
    isIframe && window.parent.removeEventListener(...args)
  },
} : undefined

export { defaultDocsWindow }
