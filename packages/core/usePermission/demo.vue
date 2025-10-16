<script setup lang="ts">
import { reactify, usePermission } from '@vueuse/core'
import { computed, reactive } from 'vue'
import YAML from 'yaml'

const stringify = reactify(
  (input: any) => YAML.stringify(input, (k, v) => {
    if (typeof v === 'function') {
      return undefined
    }
    return v
  }, {
    singleQuote: true,
    flowCollectionPadding: false,
  }),
)

const accelerometer = usePermission('accelerometer')
const accessibilityEvents = usePermission('accessibility-events')
const ambientLightSensor = usePermission('ambient-light-sensor')
const backgroundSync = usePermission('background-sync')
const camera = usePermission('camera')
const capturedSurfaceControl = usePermission('captured-surface-control')
const clipboardRead = usePermission('clipboard-read')
const clipboardWrite = usePermission('clipboard-write')
const geolocation = usePermission('geolocation')
const gyroscope = usePermission('gyroscope')
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
const localFonts = usePermission('local-fonts')

const code = computed(() => stringify(reactive({
  accelerometer,
  accessibilityEvents,
  ambientLightSensor,
  backgroundSync,
  camera,
  capturedSurfaceControl,
  clipboardRead,
  clipboardWrite,
  geolocation,
  gyroscope,
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
  localFonts,
})))
</script>

<template>
  <pre>{{ code }}</pre>
</template>
