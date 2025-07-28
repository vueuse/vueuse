import type { App, InjectionKey } from 'vue'
import { injectLocal, provideLocal } from '@vueuse/shared'
import { hasInjectionContext } from 'vue'

const ssrWidthSymbol = Symbol('vueuse-ssr-width') as InjectionKey<number | null>

/* @__NO_SIDE_EFFECTS__ */
export function useSSRWidth() {
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
