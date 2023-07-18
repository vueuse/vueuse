import { unrefElement } from '@vueuse/core'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { tryOnMounted, tryOnUnmounted } from '@vueuse/shared'
import Masonry from 'masonry-layout'
import { nextTick } from 'vue-demi'

export type UseMasonryOptions = Masonry.Options

export interface UseMasonryReturn {
  /**
   * Starts the Masonry instance.
   */
  start(): void

  /**
   * Stops the Masonry instance.
   */
  stop(): void

  /**
   * Lays out all item elements. `layout` is useful when an item has changed size, and all items need to be laid out again.
   */
  layout(): void

  /**
   * Lays out specified items.
   * @param {any[]} items - Array of `Masonry.Items`
   * @param {boolean} isStill - Disables transitions
   */
  layoutItems(items: any[], isStill: boolean): void

  /**
   * Stamps elements in the layout. Masonry will lay out item elements around stamped elements.
   * @param {any[]} elements - jQuery Object, NodeList, or Array of Elements
   */
  stamp(elements: any[]): void

  /**
   * Un-stamps elements in the layout, so that Masonry will no longer layout item elements around them.
   * @param {any[]} elements - jQuery Object, NodeList, or Array of Elements
   */
  unstamp(elements: any[]): void

  /**
   * Adds and lays out newly appended item elements to the end of the layout.
   * @param {any[]} elements - Element, jQuery Object, NodeList, or Array of Elements
   */
  appended(elements: any[]): void

  /**
   * Adds and lays out newly prepended item elements at the beginning of layout.
   * @param {any[]} elements - Element, jQuery Object, NodeList, or Array of Elements
   */
  prepended(elements: any[]): void

  /**
   * Adds item elements to the Masonry instance. addItems does not lay out items like appended or prepended.
   * @param {any[]} elements - Element, jQuery Object, NodeList, or Array of Elements
   */
  addItems(elements: any[]): void

  /**
   * Removes elements from the Masonry instance and DOM.
   * @param {any[]} elements - Element, jQuery Object, NodeList, or Array of Elements
   */
  remove(elements: any[]): void

  /**
   * Adds a Masonry event listener.
   * @param {string} eventName - Name of a Masonry event
   * @param {Function} listener - Event listener function
   */
  on(eventName: string, listener: Function): void

  /**
   * Removes a Masonry event listener.
   * @param {string} eventName - Name of a Masonry event
   * @param {Function} listener - Event listener function
   */
  off(eventName: string, listener: Function): void

  /**
   * Adds a Masonry event listener to be triggered just once.
   * @param {string} eventName - Name of a Masonry event
   * @param {Function} listener - Event listener function
   */
  once(eventName: string, listener: Function): void

  /**
   * Recollects all item elements.
   */
  reloadItems(): void

  /**
   * Removes the Masonry functionality completely. destroy will return the element back to its pre-initialized state.
   */
  destroy(): void

  /**
   * Returns an array of item elements.
   * @returns {any[]} Array of Elements
   */
  getItemElements(): any[]

  /**
  * Redraw the masonry layout.
  *
  * NOTICE:This is not a raw function from Masonry.js. Please see `this.$redrawVueMasonry` in [ this ]( https://github.com/shershen08/vue-masonry ) for more information.
  */
  redraw(): void
}

/**
 * Wrapper for [Masonry.js](https://masonry.desandro.com/)
 *
 * @param {MaybeRefOrGetter<HTMLElement | null | undefined> | string} el - The element to attach Masonry to.
 * @param {Object} options - Options for configuring Masonry. See [ docs ]( https://masonry.desandro.com/options.html ) for details.
 */
export function useMasonry(
  el: MaybeRefOrGetter<HTMLElement | null | undefined> | string,
  options?: UseMasonryOptions,
): UseMasonryReturn {
  /**
   * The Masonry instance.
   */
  let masonry: Masonry

  /**
   * Mount the Masonry instance.
   */
  function start(): void {
    const target = (typeof el === 'string' ? document?.querySelector(el) : unrefElement(el))
    if (!target)
      return
    masonry = new Masonry(target as HTMLElement, { ...options })
    redraw()
  }

  /**
   * Unmount the Masonry instance.
   */
  function stop(): void {
    masonry.destroy?.()
  }

  /**
 * Lays out all item elements. `layout` is useful when an item has changed size, and all items need to be laid out again.
 * @returns {void}
 */
  function layout(): void {
    masonry.layout?.()
  }

  /**
   * Lays out specified items.
   * @param {any[]} items - Array of `Masonry.Items`
   * @param {boolean} isStill - Disables transitions
   * @returns {void}
   */
  function layoutItems(items: any[], isStill: boolean): void {
    masonry.layoutItems?.(items, isStill)
  }

  /**
   * Stamps elements in the layout. Masonry will lay out item elements around stamped elements.
   * @param {any[]} elements - jQuery Object, NodeList, or Array of Elements
   * @returns {void}
   */
  function stamp(elements: any[]): void {
    masonry.stamp?.(elements)
  }

  /**
   * Un-stamps elements in the layout, so that Masonry will no longer layout item elements around them.
   * @param {any[]} elements - jQuery Object, NodeList, or Array of Elements
   * @returns {void}
   */
  function unstamp(elements: any[]): void {
    masonry.unstamp?.(elements)
  }

  /**
   * Adds and lays out newly appended item elements to the end of the layout.
   * @param {any[]} elements - Element, jQuery Object, NodeList, or Array of Elements
   * @returns {void}
   */
  function appended(elements: any[]): void {
    masonry.appended?.(elements)
  }

  /**
   * Adds and lays out newly prepended item elements at the beginning of layout.
   * @param {any[]} elements - Element, jQuery Object, NodeList, or Array of Elements
   * @returns {void}
   */
  function prepended(elements: any[]): void {
    masonry.prepended?.(elements)
  }

  /**
   * Adds item elements to the Masonry instance. addItems does not lay out items like appended or prepended.
   * @param {any[]} elements - Element, jQuery Object, NodeList, or Array of Elements
   * @returns {void}
   */
  function addItems(elements: any[]): void {
    masonry.addItems?.(elements)
  }

  /**
   * Removes elements from the Masonry instance and DOM.
   * @param {any[]} elements - Element, jQuery Object, NodeList, or Array of Elements
   * @returns {void}
   */
  function remove(elements: any[]): void {
    masonry.remove?.(elements)
  }

  /**
   * Adds a Masonry event listener.
   * @param {string} eventName - Name of a Masonry event
   * @param {Function} listener - Event listener function
   * @returns {void}
   */
  function on(eventName: string, listener: Function): void {
    masonry.on?.(eventName, listener)
  }

  /**
   * Removes a Masonry event listener.
   * @param {string} eventName - Name of a Masonry event
   * @param {Function} listener - Event listener function
   * @returns {void}
   */
  function off(eventName: string, listener: Function): void {
    masonry.off?.(eventName, listener)
  }

  /**
   * Adds a Masonry event listener to be triggered just once.
   * @param {string} eventName - Name of a Masonry event
   * @param {Function} listener - Event listener function
   * @returns {void}
   */
  function once(eventName: string, listener: Function): void {
    masonry.once?.(eventName, listener)
  }

  /**
   * Recollects all item elements.
   * @returns {void}
   */
  function reloadItems(): void {
    masonry.reloadItems?.()
  }

  /**
   * Removes the Masonry functionality completely. destroy will return the element back to its pre-initialized state.
   * @returns {void}
   */
  function destroy(): void {
    masonry.destroy?.()
  }

  /**
   * Returns an array of item elements.
   * @returns {any[]} Array of Elements
   */
  function getItemElements(): any[] {
    return masonry.getItemElements?.() || []
  }

  /**
   * Redraws the masonry layout.
   *
   * NOTICE:This is not a raw function from Masonry.js. Please see `this.$redrawVueMasonry` in [ this ]( https://github.com/shershen08/vue-masonry ) for more information.
   */
  function redraw() {
    masonry.reloadItems?.()
    masonry.layout?.()
  }

  tryOnMounted(() => nextTick(start))

  tryOnUnmounted(stop)

  return {
    start,
    stop,
    layout,
    layoutItems,
    stamp,
    unstamp,
    appended,
    prepended,
    addItems,
    remove,
    on,
    off,
    once,
    reloadItems,
    destroy,
    getItemElements,
    redraw,
  }
}
