<template>
  <div>isSupported:{{ isSupported }}</div>
  <div>sRGBHex:{{ sRGBHex }}</div>
  <div>
    <button
      :disabled="!isSupported"
      @click="eyeDropper"
    >
      {{ isSupported ? 'eyeDropper' : 'Not Support' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useEyeDropper } from '@vueuse/core'

const { isSupported, eyeDropper, sRGBHex } = useEyeDropper()
</script>
