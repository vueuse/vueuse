<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useDeviceLight } from '.'

const light = useDeviceLight({
  window = window.parent,
})
</script>

<template>
  <div>
    <pre lang="json">{{ JSON.stringify({ light }, null, 2) }}</pre>
  </div>
</template>
