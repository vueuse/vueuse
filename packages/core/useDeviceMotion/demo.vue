<script setup lang="ts">
import { useDeviceMotion } from '@vueuse/core'

const {
  acceleration,
  accelerationIncludingGravity,
  rotationRate,
  interval,
  isSupported,
  ensurePermissions,
  permissionGranted,
} = useDeviceMotion()
</script>

<template>
  <note class="mb-2">
    Device Motion:
  </note>
  <div v-if="!isSupported">
    Not supported by your current browser.
  </div>
  <template v-else>
    <pre
      v-if="!permissionGranted"
      lang="json"
    >{{ { acceleration, accelerationIncludingGravity, rotationRate, interval } }}</pre>
    <div v-else>
      Permission is required
    </div>
    <button v-if="!permissionGranted" @click="ensurePermissions">
      Request Permission
    </button>
  </template>
</template>
