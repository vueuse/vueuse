<script setup lang="ts">
import { usePermission } from '@vueuse/core'
import YAML from 'js-yaml'
import { computed, reactive } from 'vue'

const accelerometer = usePermission('accelerometer')
const accessibilityEvents = usePermission('accessibility-events')
const ambientLightSensor = usePermission('ambient-light-sensor')
const backgroundSync = usePermission('background-sync')
const camera = usePermission('camera')
const clipboardRead = usePermission('clipboard-read')
const clipboardWrite = usePermission('clipboard-write')
const computePressure = usePermission('compute-pressure')
const geolocation = usePermission('geolocation')
const gyroscope = usePermission('gyroscope')
const localFonts = usePermission('local-fonts')
const magnetometer = usePermission('magnetometer')
const microphone = usePermission('microphone')
const midi = usePermission('midi')
const notifications = usePermission('notifications')
const paymentHandler = usePermission('payment-handler')
const persistentStorage = usePermission('persistent-storage')
const push = usePermission('push')
const screenWakeLock = usePermission('screen-wake-lock')
const storageAccess = usePermission('storage-access')
const topLevelStorageAccess = usePermission('top-level-storage-access')
const windowManagement = usePermission('window-management')

const code = computed(() => YAML.dump(reactive({
  accelerometer,
  accessibilityEvents,
  ambientLightSensor,
  backgroundSync,
  camera,
  clipboardRead,
  clipboardWrite,
  computePressure,
  geolocation,
  gyroscope,
  localFonts,
  magnetometer,
  microphone,
  midi,
  notifications,
  paymentHandler,
  persistentStorage,
  push,
  screenWakeLock,
  storageAccess,
  topLevelStorageAccess,
  windowManagement,
})))
</script>

<template>
  <pre>{{ code }}</pre>
</template>
