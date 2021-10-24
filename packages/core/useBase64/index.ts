import { Ref, ref, unref, watch } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'

interface Base64Options {
  onError: (e: Error) => void
}
interface ToDataURLOptions extends Base64Options {
  type?: string | undefined
  quality?: any
}

interface UseBase64Result {
  base64: Ref<string>
  execute: () => void
}

export function useBase64(target: MaybeRef<string>, options: Base64Options): UseBase64Result
export function useBase64(target: MaybeRef<Blob>, options: Base64Options): UseBase64Result
export function useBase64(target: MaybeRef<HTMLCanvasElement>, options?: ToDataURLOptions): UseBase64Result
export function useBase64(target: MaybeRef<HTMLImageElement>, options?: ToDataURLOptions): UseBase64Result
export function useBase64(
  target: any,
  options?: any,
) {
  const base64 = ref('')

  async function execute() {
    try {
      const _target = unref(target)
      if (_target instanceof HTMLCanvasElement) { base64.value = _target.toDataURL(options?.type, options?.quality) }
      else if (typeof _target === 'string') { base64.value = await blobToBase64(new Blob([_target], { type: 'text/plain' })) }
      else if (_target instanceof Blob) { base64.value = await blobToBase64(_target) }
      else if (_target instanceof HTMLImageElement) {
        const img = _target.cloneNode(false) as HTMLImageElement
        img.crossOrigin = 'Anonymous'
        await imgLoaded(img)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        base64.value = canvas.toDataURL(options?.type, options?.quality)
      }
    }
    catch (error) {
      if (options?.onError)
        options.onError(error)
    }
  }

  watch(target, execute, {
    immediate: true,
  })

  return {
    base64,
    execute,
  }
}

export function imgLoaded(img: HTMLImageElement) {
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

export function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = (e) => {
      resolve(e.target!.result as string)
    }
    fr.onerror = reject
    fr.readAsDataURL(blob)
  })
}
