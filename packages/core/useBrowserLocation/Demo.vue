<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useBrowserLocation } from '.'

const location = useBrowserLocation()
</script>

<template>
  <pre lang="json">{{ JSON.stringify({ location }, null, 2) }}</pre>
</template>
