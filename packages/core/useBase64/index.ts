import type { Ref } from 'vue-demi'
import { isRef, ref, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { isClient, isFunction, resolveUnref } from '@vueuse/shared'
import { getDefaultSerialization } from './serialization'

export interface ToDataURLOptions {
  /**
   * MIME type
   */
  type?: string | undefined
  /**
   * Image quality of jpeg or webp
   */
  quality?: any
}

export interface UseBase64ObjectOptions<T> {
  serializer: (v: T) => string
}

export interface UseBase64Return {
  base64: Ref<string>
  promise: Ref<Promise<string>>
  execute: () => Promise<string>
}

export function useBase64(target: MaybeComputedRef<string>): UseBase64Return
export function useBase64(target: MaybeComputedRef<Blob>): UseBase64Return
export function useBase64(target: MaybeComputedRef<ArrayBuffer>): UseBase64Return
export function useBase64(target: MaybeComputedRef<HTMLCanvasElement>, options?: ToDataURLOptions): UseBase64Return
export function useBase64(target: MaybeComputedRef<HTMLImageElement>, options?: ToDataURLOptions): UseBase64Return
export function useBase64<T extends Record<string, unknown>>(target: MaybeComputedRef<T>, options?: UseBase64ObjectOptions<T>): UseBase64Return
export function useBase64<T extends Map<string, unknown>>(target: MaybeComputedRef<T>, options?: UseBase64ObjectOptions<T>): UseBase64Return
export function useBase64<T extends Set<unknown>>(target: MaybeComputedRef<T>, options?: UseBase64ObjectOptions<T>): UseBase64Return
export function useBase64<T>(target: MaybeComputedRef<T[]>, options?: UseBase64ObjectOptions<T[]>): UseBase64Return
export function useBase64(
  target: any,
  options?: any,
) {
  const base64 = ref('')
  const promise = ref() as Ref<Promise<string>>

  function execute() {
    if (!isClient)
      return

    promise.value = new Promise<string>((resolve, reject) => {
      try {
        const _target = resolveUnref(target)
        if (_target == null) {
          resolve('')
        }
        else if (typeof _target === 'string') {
          resolve(blobToBase64(new Blob([_target], { type: 'text/plain' })))
        }
        else if (_target instanceof Blob) {
          resolve(blobToBase64(_target))
        }
        else if (_target instanceof ArrayBuffer) {
          resolve(window.btoa(String.fromCharCode(...new Uint8Array(_target))))
        }
        else if (_target instanceof HTMLCanvasElement) {
          resolve(_target.toDataURL(options?.type, options?.quality))
        }
        else if (_target instanceof HTMLImageElement) {
          const img = _target.cloneNode(false) as HTMLImageElement
          img.crossOrigin = 'Anonymous'
          imgLoaded(img).then(() => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL(options?.type, options?.quality))
          }).catch(reject)
        }
        else if (typeof _target === 'object') {
          const _serializeFn = options?.serializer || getDefaultSerialization(_target)

          const serialized = _serializeFn(_target)

          return resolve(blobToBase64(new Blob([serialized], { type: 'application/json' })))
        }
        else {
          reject(new Error('target is unsupported types'))
        }
      }
      catch (error) {
        reject(error)
      }
    })
    promise.value.then(res => base64.value = res)
    return promise.value
  }

  if (isRef(target) || isFunction(target))
    watch(target, execute, { immediate: true })
  else
    execute()

  return {
    base64,
    promise,
    execute,
  }
}

function imgLoaded(img: HTMLImageElement) {
  return new Promise<void>((resolve, reject) => {
    if (!img.complete) {
      img.onload = () => {
        resolve()
      }
      img.onerror = reject
    }
    else {
      resolve()
    }
  })
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = (e) => {
      resolve(e.target!.result as string)
    }
    fr.onerror = reject
    fr.readAsDataURL(blob)
  })
}
