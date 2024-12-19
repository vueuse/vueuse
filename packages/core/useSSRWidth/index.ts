import type { App, InjectionKey } from 'vue'
import { hasInjectionContext, inject, provide } from 'vue'

const ssrWidthSymbol = Symbol('SSR Width') as InjectionKey<number | null>

export function useSSRWidth() {
  // Avoid injection warning outside of components
  const ssrWidth = hasInjectionContext() ? inject(ssrWidthSymbol, null) : null
  return typeof ssrWidth === 'number' ? ssrWidth : undefined
}

export function provideSSRWidth(width: number | null, app?: App<unknown>) {
  if (app !== undefined) {
    app.provide(ssrWidthSymbol, width)
  }
  else {
    provide(ssrWidthSymbol, width)
  }
}
