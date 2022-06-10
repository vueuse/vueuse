<script setup lang="ts">
import { useInternalClock } from '.'

const { currentTime } = useInternalClock()
</script>

<template>
  <div>
    <p>Current Time: {{ currentTime }}</p>
  </div>
</template>
