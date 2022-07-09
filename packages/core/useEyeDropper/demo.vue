<script lang="ts" setup>
import { useEyeDropper } from '@vueuse/core'

const { isSupported, open, sRGBHex } = useEyeDropper()
</script>

<template>
  <template v-if="isSupported">
    <div>isSupported: {{ isSupported }}</div>
    <div>sRGBHex: <span :style="{ color: sRGBHex }">{{ sRGBHex }}</span></div>
    <button
      :disabled="!isSupported"
      @click="() => open()"
    >
      Open Eye Dropper
    </button>
  </template>
  <div v-else>
    <span>Not Supported by Your Browser</span>
  </div>
</template>
