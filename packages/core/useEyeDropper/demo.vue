<template>
  <template v-if="isSupported">
    <div>isSupported: {{ isSupported }}</div>
    <div>sRGBHex: <span :style="{ color: sRGBHex }">{{ sRGBHex }}</span></div>
  </template>
  <div>
    <button
      :disabled="!isSupported"
      @click="() => open()"
    >
      {{ isSupported ? 'Open Eye Dropper' : 'Not Supported by Your Browser' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useEyeDropper } from '@vueuse/core'

const { isSupported, open, sRGBHex } = useEyeDropper()
</script>
