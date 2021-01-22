<script setup lang="ts">
import { useDeviceLight } from '.'

const light = useDeviceLight()
</script>

<template>
  <note class="mb-2">
    Device Light:
  </note>
  <code>{{ `${light}` }}</code>
</template>
