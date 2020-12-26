<script setup lang="ts">
import { usePreferredDark } from '.'

const prefersDark = usePreferredDark()
</script>

<template>
  <p>Prefers Dark: {{ prefersDark }}</p>
</template>
