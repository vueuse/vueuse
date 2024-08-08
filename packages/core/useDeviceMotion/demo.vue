<script setup lang="ts">
import { useDeviceMotion } from './index'

const { acceleration, accelerationIncludingGravity, rotationRate, interval, requirePermission, permissionGranted, trigger } = useDeviceMotion()
</script>

<template>
  <note class="mb-2">
    Device Motion:
  </note>
  <pre
    v-if="!requirePermission || permissionGranted"
    lang="json"
  >{{ { acceleration, accelerationIncludingGravity, rotationRate, interval } }}</pre>
  <div v-else>
    Permission is required
  </div>

  <button v-if="requirePermission && !permissionGranted" @click="trigger">
    Request Permission
  </button>
</template>
