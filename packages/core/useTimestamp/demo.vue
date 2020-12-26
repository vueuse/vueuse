<script setup lang="ts">
import { useTimestamp } from '.'

const { timestamp } = useTimestamp()
</script>

<template>
  <div>
    <p>Now: {{ timestamp }}</p>
  </div>
</template>
