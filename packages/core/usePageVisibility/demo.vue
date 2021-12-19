<script setup lang="ts">
import { usePageVisibility } from '.'

const { visibilityState } = usePageVisibility()
</script>

<template>
  <div>Page Visibility: <b>{{ visibilityState }}</b></div>
</template>
