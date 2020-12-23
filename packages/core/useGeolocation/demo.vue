<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useGeolocation } from '.'

return useGeolocation()
</script>

<template>
  <div>
    <pre lang="json"
      >{{
        JSON.stringify(
          {
            coords: {
              accuracy: coords.accuracy,
              latitude: coords.latitude,
              longitude: coords.longitude,
              altitude: coords.altitude,
              altitudeAccuracy: coords.altitudeAccuracy,
              heading: coords.heading,
              speed: coords.speed,
            },
            locatedAt,
            error: error ? error.message : error,
          },
          null,
          2
        )
      }}
        </pre
    >
  </div>
</template>
