<script setup lang="ts">
import { usePreferredDark } from '.'

const prefersDark = usePreferredDark()
</script>

<template>
  <note class="mb-2">
    Prefers Dark:
  </note>
  <code>{{ prefersDark }}</code>
</template>
