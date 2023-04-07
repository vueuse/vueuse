---
category: Browser
---

# useBarcodeDetector

Reactive [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API)

## Usage

```ts
import { ref } from 'vue'
import { useBarcodeDetector } from '@vueuse/core'

const image = ref()
const { isSupported, supportedFormats, barcodes, error } = useBarcodeDetector(image)
```
