import { Ref, ref, unref, watch } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'

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

export interface UseBase64Return {
  base64: Ref<string>
  promise: Ref<Promise<string>>
  execute: () => Promise<string>
}

export function useBase64(target: MaybeRef<string>): UseBase64Return
export function useBase64(target: MaybeRef<Blob>): UseBase64Return
export function useBase64(target: MaybeRef<ArrayBuffer>): UseBase64Return
export function useBase64(target: MaybeRef<HTMLCanvasElement>, options?: ToDataURLOptions): UseBase64Return
export function useBase64(target: MaybeRef<HTMLImageElement>, options?: ToDataURLOptions): UseBase64Return
export function useBase64(
  target: any,
  options?: any,
) {
  const base64 = ref('')
  const promise = ref() as Ref<Promise<string>>

  function execute() {
    promise.value = new Promise<string>((resolve, reject) => {
      try {
        const _target = unref(target)
        // undefined or null
        if (_target === undefined || _target === null) { resolve('') }
        else if (typeof _target === 'string') { resolve(blobToBase64(new Blob([_target], { type: 'text/plain' }))) }
        else if (_target instanceof Blob) { resolve(blobToBase64(_target)) }
        else if (_target instanceof ArrayBuffer) { resolve(window.btoa(String.fromCharCode(...new Uint8Array(_target)))) }
        else if (_target instanceof HTMLCanvasElement) { resolve(_target.toDataURL(options?.type, options?.quality)) }
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

  watch(target, execute, { immediate: true })

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
