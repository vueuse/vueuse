import { computed, ref, watch } from 'vue-demi'

import type { Ref } from 'vue-demi'

import { useElementBounding } from '../useElementBounding'

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
 * @param element (HTML Canavs Element) template ref
 * @param attributes
 * @param options
 * @see https://vueuse.org/useCanvas
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 */
export function useCanvas2D(
  el: Ref<HTMLCanvasElement | null>,
  bound: Ref<HTMLElement | null>,
  attributes?: UseCanvasAttributes,
) {
  // Reactive canvas element:
  const canvas = el

  const ctx = ref<undefined | CanvasRenderingContext2D>(undefined)

  const isCanvasRenderingContext2D = (v: RenderingContext): v is CanvasRenderingContext2D => {
    return !!v && v instanceof CanvasRenderingContext2D
  }

  const getContext = (): undefined | CanvasRenderingContext2D => {
    if (!canvas.value) return undefined

    const context = canvas.value.getContext('2d', attributes)

    if (context && isCanvasRenderingContext2D(context))
      return context

    return undefined
  }

  watch(canvas, (canvasValue) => {
    if (!canvasValue) return
    ctx.value = getContext()
  })

  const isReady = computed(() => {
    return !!ctx.value
  })

  const { width: rectWidth, height: rectHeight } = useElementBounding(bound)

  watch(rectWidth, (widthValue) => {
    if (!canvas.value) return
    canvas.value.width = widthValue
  })

  watch(rectHeight, (heightValue) => {
    if (!canvas.value) return
    canvas.value.height = heightValue
  })

  return {
    ctx,
    isReady,
    width: rectWidth,
    height: rectHeight,
  }
}

export type UseCanvas2DReturn = ReturnType<typeof useCanvas2D>
