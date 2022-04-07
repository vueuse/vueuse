import type { Ref } from 'vue-demi'
import { computed, unref } from 'vue-demi'

import type { MaybeRef } from '@vueuse/core'

export interface UseCanvasContextMap {
  '2d': CanvasRenderingContext2D
  'bitmaprenderer': ImageBitmapRenderingContext
  'webgl': WebGLRenderingContext
  'webgl2': WebGL2RenderingContext
}

export interface UseCanvasContextSettingsMap {
  '2d': CanvasRenderingContext2DSettings
  'bitmaprenderer': ImageBitmapRenderingContextSettings
  'webgl': WebGLContextAttributes
  'webgl2': WebGLContextAttributes
}

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
export type UseCanvasContextType = keyof UseCanvasContextSettingsMap

export type ContextSettings = CanvasRenderingContext2DSettings
| ImageBitmapRenderingContextSettings
| WebGLContextAttributes

export interface UseCanvasContextOptions<S extends UseCanvasContextType> {
  settings?: MaybeRef<UseCanvasContextSettingsMap[S]>
}

/**
  * Reactive 2D Canvas API
  *
  * @param el (HTML Canavs Element) template ref
  * @param contextType Rendering context type
  * @param options
  * @see https://vueuse.org/useCanvas
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
  * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
  */
export function useCanvasContext<Type extends UseCanvasContextType>(
  el: MaybeRef<HTMLCanvasElement | null>,
  contextType?: MaybeRef<Type | string>,
  options?: UseCanvasContextOptions<Type>,
): {
  ctx: Ref<UseCanvasContextMap[Type] | null>
}

export function useCanvasContext(
  el: MaybeRef<HTMLCanvasElement | null>,
  contextType: MaybeRef<string> = '2d',
  options: UseCanvasContextOptions<any> = {},
): {
    ctx: Ref<RenderingContext | null>
  } {
  const { settings } = options

  // Reactive canvas context:
  const ctx = computed(() => unref(el)?.getContext(unref(contextType), unref(settings)) || null)

  return { ctx }
}

export type UseCanvasContextReturn = ReturnType<typeof useCanvasContext>
