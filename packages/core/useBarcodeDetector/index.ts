import { ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveRef, tryOnMounted, whenever } from '@vueuse/shared'
import { useSupported } from '../useSupported'
import { defaultWindow } from '../_configurable'
import type { ConfigurableWindow } from '../_configurable'

export type BarcodeFormat = 'aztec' | 'code_128' | 'code_39' | 'code_93' | 'codabar' | 'data_matrix' | 'ean_13' | 'ean_8' | 'itf' | 'pdf417' | 'qr_code' | 'upc_a' | 'upc_e' | 'unknown'

export interface BarcodeCornerPoint {
  x: number
  y: number
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector/detect#return_value
 */
export interface DetectedBarcode {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMRectReadOnly
   */
  boundingBox: DOMRectReadOnly
  cornerPoints: BarcodeCornerPoint[]
  format: BarcodeFormat
  rawValue: string
}

export interface BarcodeDetectorOptions {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#supported_barcode_formats
   */
  formats?: BarcodeFormat[]
}

export interface BarcodeDetector {
  new(options?: BarcodeDetectorOptions): BarcodeDetectorInstance
  getSupportedFormats: () => Promise<BarcodeFormat[]>
}

export interface BarcodeDetectorInstance {
  detect: (imageBitmapSource: ImageBitmapSource) => Promise<DetectedBarcode[]>
}

export type UseBarcodeDetectorOptions = {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#supported_barcode_formats
   */
  formats?: BarcodeFormat[]
} & ConfigurableWindow

/**
 * Reactive [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API)
 *
 * @see https://vueuse.org/useBarcodeDetector
 */
export function useBarcodeDetector(source: MaybeComputedRef<ImageBitmapSource | null | undefined>, options: UseBarcodeDetectorOptions = {}) {
  const { window = defaultWindow, formats } = options
  const image = resolveRef(source)
  const isSupported = useSupported(() => typeof window !== 'undefined' && 'BarcodeDetector' in window)
  const supportedFormats = ref<BarcodeFormat[]>([])
  const barcodes = ref<DetectedBarcode[]>([])
  const error = ref<unknown | undefined>(undefined)

  tryOnMounted(async () => {
    if (!isSupported.value)
      return

    const BD = (window as any).BarcodeDetector as BarcodeDetector
    const detector = new BD({ formats })
    supportedFormats.value = await BD.getSupportedFormats()

    whenever(image, async (val) => {
      barcodes.value = []
      error.value = undefined

      try {
        barcodes.value = await detector.detect(val)
      }
      catch (err) {
        error.value = err
      }
    },
    { immediate: true })
  })

  return { isSupported, supportedFormats, barcodes, error }
}

export type UseBarcodeDetectorReturn = ReturnType<typeof useBarcodeDetector>
