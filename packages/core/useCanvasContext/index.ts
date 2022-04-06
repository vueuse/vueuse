import { computed, isRef, ref, watch } from 'vue-demi'

import type { MaybeRef } from '@vueuse/shared'

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
export type UseCanvasContextType = '2d' | 'webgl'

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
  el: MaybeRef<HTMLCanvasElement | null>,
  contextId: UseCanvasContextType,
  attributes?: UseCanvasAttributes,
) {
  // Reactive canvas element:
  const canvas = isRef(el) ? el : ref<HTMLCanvasElement | null>(el)

  // Reactive canvas context:
  const ctx = ref<undefined | CanvasRenderingContext2D | WebGL2RenderingContext>(undefined)

  // Ensure the rendering context is a 2D context:
  const isCanvasRenderingContext2D = (v: RenderingContext): v is CanvasRenderingContext2D => {
    return !!v && v instanceof CanvasRenderingContext2D
  }

  // Ensure the rendering context is a WebGL context:
  const isCanvasRenderingContextWebGL = (v: RenderingContext): v is WebGL2RenderingContext => {
    return !!v && v instanceof WebGL2RenderingContext
  }

  // Wrapper functionality for getting the context
  const getContext = (): undefined | CanvasRenderingContext2D | WebGL2RenderingContext => {
    if (!canvas.value)
      return undefined

    const context = canvas.value.getContext(contextId, attributes)

    if (context && isCanvasRenderingContext2D(context))
      return context

    if (context && isCanvasRenderingContextWebGL(context))
      return context

    return undefined
  }

  // Watching the canvas to ensure we can get the canvas' context:
  watch(canvas, (canvasValue) => {
    if (!canvasValue)
      return

    ctx.value = getContext()
  }, {
    immediate: true,
  })

  // Are we ready to work with the canvas context?
  const isReady = computed(() => {
    return !!ctx.value
  })

  return {
    ctx,
    isCanvasRenderingContext2D,
    isCanvasRenderingContextWebGL,
    isReady,
  }
}

export type useCanvasContextReturn = ReturnType<typeof useCanvasContext>
