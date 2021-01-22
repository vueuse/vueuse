<script setup lang="ts">
import { usePreferredColorScheme } from '.'

const colroScheme = usePreferredColorScheme()
</script>

<template>
  <note class="mb-2">
    Preferred Color Scheme:
  </note>
  <code>{{ colroScheme }}</code>
</template>
