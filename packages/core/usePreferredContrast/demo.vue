<script setup lang="ts">
import { usePreferredContrast } from '@vueuse/core'

const contrast = usePreferredContrast()
</script>

<template>
  <note class="mb-2">
    Preferred contrast:
  </note>
  <code>{{ contrast }}</code>
</template>
