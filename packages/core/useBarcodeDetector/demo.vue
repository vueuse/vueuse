<script lang="ts" setup>
import { ref } from 'vue'
import { useBarcodeDetector } from '@vueuse/core'
import { useQRCode } from '../../integrations/useQRCode'

const text = ref('https://vueuse.org')
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 3,
})

const image = ref<HTMLImageElement>()
const { isSupported, barcodes, detect } = useBarcodeDetector(image)
</script>

<template>
  <template v-if="isSupported">
    <note>
      Text content for QRCode
    </note>
    <input v-model="text" type="text">
    <img v-if="text" ref="image" class="mt-6 mb-2 rounded border" :src="qrcode" alt="QR Code">

    <button
      :disabled="!isSupported"
      @click="detect()"
    >
      Detect
    </button>

    <note class="mt06">
      Result
    </note>
    <pre><code>{{ JSON.stringify(barcodes, null, 2) }}</code></pre>
  </template>

  <div v-else>
    <span>Not Supported by Your Browser</span>
  </div>
</template>
