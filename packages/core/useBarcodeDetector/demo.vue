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
const { isSupported, barcodes } = useBarcodeDetector(image)
</script>

<template>
  <template v-if="isSupported">
    <input v-model="text" type="text">
    <img v-if="text" ref="image" :key="text" :src="qrcode" class="mt-4 rounded border" alt="QR Code">

    <note class="mt-6">
      Detected:
    </note>
    <pre><code>{{ JSON.stringify(barcodes, null, 2) }}</code></pre>
  </template>

  <div v-else>
    <span>Not Supported by Your Browser</span>
  </div>
</template>
