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
const geolocation = usePermission('geolocation')
const gyroscope = usePermission('gyroscope')
const magnetometer = usePermission('magnetometer')
const microphone = usePermission('microphone')
const notifications = usePermission('notifications')
const paymentHandler = usePermission('payment-handler')
const persistentStorage = usePermission('persistent-storage')
const push = usePermission('push')
const speaker = usePermission('speaker')
const localFonts = usePermission('local-fonts')

const code = computed(() => YAML.dump(reactive({
  accelerometer,
  accessibilityEvents,
  ambientLightSensor,
  backgroundSync,
  camera,
  clipboardRead,
  clipboardWrite,
  geolocation,
  gyroscope,
  magnetometer,
  microphone,
  notifications,
  paymentHandler,
  persistentStorage,
  push,
  speaker,
  localFonts,
})))
</script>

<template>
  <pre>{{ code }}</pre>
</template>
