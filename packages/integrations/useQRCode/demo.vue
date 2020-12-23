<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useQRCode } from './index'

const text = ref('https://vueuse.js.org')
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 3,
})

const qrcode, text
</script>

<template>
  <div>
    <input v-model="text" />
    <img class="ml-1 mt-6 mb-2 rounded" :src="qrcode" alt="QR Code" />
  </div>
</template>
