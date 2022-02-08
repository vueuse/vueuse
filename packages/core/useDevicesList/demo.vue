<script setup lang="ts">
import { useDevicesList } from '.'

const {
  videoInputs: cameras,
  audioInputs: microphones,
  audioOutputs: speakers,
} = useDevicesList({
  requestPermissions: true,
})
</script>

<template>
  <div class="grid grid-cols-3 text-center" gap="2" p="y-4">
    <carbon:camera />
    <carbon:microphone />
    <carbon:headphones />

    <div class="title">
      Camera ({{ cameras.length }})
    </div>
    <div class="title">
      Microphones ({{ microphones.length }})
    </div>
    <div class="title">
      Speakers ({{ speakers.length }})
    </div>

    <div>
      <div v-for="i of cameras" :key="i.deviceId" text="sm">
        {{ i.label }}
      </div>
    </div>

    <div>
      <div v-for="i of microphones" :key="i.deviceId" text="sm">
        {{ i.label }}
      </div>
    </div>

    <div>
      <div v-for="i of speakers" :key="i.deviceId" text="sm">
        {{ i.label }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
svg {
  @apply text-2xl opacity-50 m-auto;
}

.title {
  @apply opacity-50 uppercase tracking-wide text-sm;
}
</style>
