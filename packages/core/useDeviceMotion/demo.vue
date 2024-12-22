<script setup lang="ts">
import { useDeviceMotion } from '@vueuse/core'

const { acceleration, accelerationIncludingGravity, rotationRate, interval, ensurePermissions, permissionGranted, trigger } = useDeviceMotion()
</script>

<template>
  <note class="mb-2">
    Device Motion:
  </note>
  <pre
    v-if="!ensurePermissions || permissionGranted"
    lang="json"
  >{{ { acceleration, accelerationIncludingGravity, rotationRate, interval } }}</pre>
  <div v-else>
    Permission is required
  </div>

  <button v-if="ensurePermissions && !permissionGranted" @click="trigger">
    Request Permission
  </button>
</template>
