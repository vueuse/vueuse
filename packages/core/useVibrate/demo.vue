<script setup lang="ts">
import { useVibrate } from './index'

const {
  isSupported,
  vibrate,
  stop,
} = useVibrate()
</script>

<template>
  <div class="grid grid-cols-1 gap-x-4 gap-y-4">
    <div>{{ isSupported ? 'Vibration API Supported' : 'Your browser does not support the Vibration API' }}</div>

    <div v-if="isSupported">
      <button @click="vibrate()">
        Vibrate
      </button>

      <button @click="stop()">
        Stop
      </button>
    </div>
  </div>
</template>
