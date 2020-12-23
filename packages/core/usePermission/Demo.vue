<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { usePermission } from '.'

const geolocation = usePermission('geolocation'),
  microphone = usePermission('microphone'),
  notifications = usePermission('notifications'),
  camera = usePermission('camera'),
  midi = usePermission('midi')
</script>

<template>
  <div>
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
  </div>
</template>
