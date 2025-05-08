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

const code = computed(() => stringify(reactive({
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
