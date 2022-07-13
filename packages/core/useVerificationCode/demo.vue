<script setup lang="ts">
import { useVerificationCode } from '@vueuse/core'

const { seconds, isActive, getCode } = useVerificationCode({
  /** Start the countdown at what */
  seconds: 30,
  /**  Whether to refresh to continue countdown upon re-entry */
  keepRunning: true,
})
</script>

<template>
  <div v-if="isActive">
    {{ seconds }}
  </div>
  <button v-else @click="getCode">
    发送验证码
  </button>
</template>
