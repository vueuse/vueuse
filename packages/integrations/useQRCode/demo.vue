<script setup lang="ts">
import { ref } from 'vue'
import { useQRCode } from '.'

const text = ref('https://vueuse.org')
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 3,
})
</script>

<template>
  <note>
    Text content for QRCode
  </note>
  <input v-model="text" type="text">
  <img v-if="text" class="mt-6 mb-2 rounded border" :src="qrcode" alt="QR Code">
</template>
