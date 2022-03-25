import { computed, ref, watch } from 'vue-demi'

import type { Ref } from 'vue-demi'

/**
   *
   * A DOMString containing the context identifier
   * defining the drawing context associated to the canvas.
   *
   * Note: The identifier "experimental-webgl" is used in
   * new implementations of WebGL. These implementations
   * have either not reached test suite conformance,
   * or the graphics drivers on the platform are not yet
   * stable.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
   *
   * @default '2d'
   *
   */
export type UseCanvasContextType = '2d' | 'webgl' | 'experimental-webgl' | 'webgl2' | 'bitmaprenderer'

export interface UseCanvasAttributes {
  /**
   *
   * Boolean that indicates if the canvas contains an alpha buffer.
   *
   */
  alpha?: boolean
  /**
   *
   * Boolean that hints the user agent to reduce the latency by
   * desynchronizing the canvas paint cycle from the event loop
   */
  desynchronized?: boolean
}

/**
 * Reactive 2D Canvas API
 *
 * @param el (HTML Canavs Element) template ref
 * @param attributes 2D Canvas Attributes
 * @see https://vueuse.org/useCanvas
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
 */
export function useCanvasContext(
  el: Ref<HTMLCanvasElement | null>,
  attributes?: UseCanvasAttributes,
) {
  // Reactive canvas element:
  const canvas = el

  // Reactive canvas context:
  const ctx = ref<undefined | CanvasRenderingContext2D>(undefined)

  // Ensure the rendering context is a 2D context:
  const isCanvasRenderingContext2D = (v: RenderingContext): v is CanvasRenderingContext2D => {
    return !!v && v instanceof CanvasRenderingContext2D
  }

  // Wrapper functionality for getting the context
  const getContext = (): undefined | CanvasRenderingContext2D => {
    if (!canvas.value) return undefined

    const context = canvas.value.getContext('2d', attributes)

    if (context && isCanvasRenderingContext2D(context))
      return context

    return undefined
  }

  // Watching the canvas to ensure we can get the canvas' context:
  watch(canvas, (canvasValue) => {
    if (!canvasValue) return
    ctx.value = getContext()
  }, {
    immediate: true,
  })

  // Are we ready to work with the canvas context?
  const isReady = computed(() => {
    return !!ctx.value
  })

  return {
    isReady,
    ctx,
  }
}

export type useCanvasContextReturn = ReturnType<typeof useCanvasContext>
