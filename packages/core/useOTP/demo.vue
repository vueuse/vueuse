<script setup lang="ts">
import { useOTP } from '@vueuse/core'

const { otp, fetchOTP } = useOTP() // Updated function name

const clazz = computed(() => otp.value ? 'text-green-500' : 'text-yellow-500')
const text = computed(() => otp.value ? `OTP: ${otp.value}` : 'Waiting for OTP...')
</script>

<template>
  <p class="mb-2">
    Autofill OTP will trigger if supported by your browser.
  </p>
  <div>Status: <span :class="clazz">{{ text }}</span></div>
  <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" @click="fetchOTP">
    Fetch OTP
  </button> <!-- Updated function name -->
</template>
