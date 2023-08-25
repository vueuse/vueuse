/**
 * Resolves an element from a given element, window, or document.
 *
 * @internal
 */
export function resolveElement(
  el: HTMLElement | SVGElement | Window | Document | null | undefined,
): HTMLElement | SVGElement | null | undefined {
  if (typeof Window !== 'undefined' && el instanceof Window)
    return el.document.documentElement

  if (typeof Document !== 'undefined' && el instanceof Document)
    return el.documentElement

  return el as HTMLElement | SVGElement | null | undefined
}
