// Hilfstyp, um den ersten Parameter aus einem Tuple zu entfernen
import type { BrowserCommand } from 'vitest/node'

type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never

// Typ, um den Typ einer Funktion ohne den ersten Parameter zu erhalten
type OmitFirstParameter<T extends (...args: any) => any> = (
  ...args: Tail<Parameters<T>>
) => ReturnType<T>

export const zoomIn: BrowserCommand<[]> = async (
  ctx,
) => {
  if (ctx.provider.name === 'playwright') {
    const page = ctx.page
    return await page.evaluate(() => {
      document.body.style.zoom = '2'
    })
  }
}

export const resetZoom: BrowserCommand<[]> = async (
  ctx,
) => {
  if (ctx.provider.name === 'playwright') {
    const page = ctx.page
    return await page.evaluate(() => {
      document.body.style.zoom = '1'
    })
  }
}

declare module '@vitest/browser/context' {
  interface BrowserCommands {
    resetZoom: OmitFirstParameter<typeof resetZoom>
    zoomIn: OmitFirstParameter<typeof zoomIn>
  }
}
