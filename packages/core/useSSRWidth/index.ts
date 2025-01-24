import type { App, InjectionKey } from 'vue'
import { injectLocal, provideLocal } from '@vueuse/shared'
import { getCurrentInstance, hasInjectionContext } from 'vue'

const ssrWidthSymbol = Symbol('vueuse-ssr-width') as InjectionKey<number | null>

/* @__NO_SIDE_EFFECTS__ */
export function useSSRWidth() {
  // Hydration has already been done, don't provide a SSR width anymore
  if (getCurrentInstance()?.root.isMounted) {
    return undefined
  }
  // Avoid injection warning outside of components
  const ssrWidth = hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null
  return typeof ssrWidth === 'number' ? ssrWidth : undefined
}

export function provideSSRWidth(width: number | null, app?: App<unknown>) {
  if (app !== undefined) {
    app.provide(ssrWidthSymbol, width)
  }
  else {
    provideLocal(ssrWidthSymbol, width)
  }
}
