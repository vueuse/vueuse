<script setup lang="ts">
import { usePermission } from '.'

const geolocation = usePermission('geolocation')
const microphone = usePermission('microphone')
const notifications = usePermission('notifications')
const camera = usePermission('camera')
const midi = usePermission('midi')
</script>

<template>
  <pre lang="json">{{
    JSON.stringify(
      {
        geolocation,
        microphone,
        notifications,
        camera,
        midi,
      },
      null,
      2
    )
  }}</pre>
</template>
