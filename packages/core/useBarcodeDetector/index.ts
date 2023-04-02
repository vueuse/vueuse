import { ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { tryOnMounted } from '@vueuse/shared'
import { useSupported } from '../useSupported'
import { useAsyncState } from '../useAsyncState'
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
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new(options?: BarcodeDetectorOptions): BarcodeDetector
  getSupportedFormats: () => Promise<BarcodeFormat[]>
  detect: (imageBitmapSource: ImageBitmapSource) => Promise<DetectedBarcode[]>
  [Symbol.toStringTag]: 'BarcodeDetector'
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
export function useBarcodeDetector(image: MaybeRef<ImageBitmapSource | null | undefined>, options: UseBarcodeDetectorOptions = {}) {
  const { window = defaultWindow, formats } = options
  const isSupported = useSupported(() => typeof window !== 'undefined' && 'BarcodeDetector' in window)
  const supportedFormats = ref<BarcodeFormat[]>([])
  const _image = ref(image)

  let detector: BarcodeDetector | null = null

  tryOnMounted(async () => {
    if (!isSupported.value)
      return

    const BD = (window as any).BarcodeDetector as BarcodeDetector

    detector = new BD({ formats })
    supportedFormats.value = await BD.getSupportedFormats()
  })

  const baseDetect = async (source: ImageBitmapSource) => {
    if (!isSupported.value || !window || !detector)
      return []

    return detector.detect(source)
  }

  const { state: barcodes, error, execute } = useAsyncState(baseDetect, [])

  const detect = async () => {
    if (!_image.value)
      return

    return execute(0, _image.value)
  }

  return { isSupported, supportedFormats, error, barcodes, detect }
}

export type UseBarcodeDetectorReturn = ReturnType<typeof useBarcodeDetector>
