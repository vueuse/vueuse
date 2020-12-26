<script setup lang="ts">
import { usePreferredColorScheme } from '.'

const colroScheme = usePreferredColorScheme()
</script>

<template>
  <p>Preferred Color Scheme: {{ colroScheme.toString() }}</p>
</template>
