<script setup lang="ts">
import { defineComponent, reactive } from 'vue-demi'
import { useBattery } from '.'

const battery = reactive(useBattery())
</script>

<template>
  <div>
    <pre lang="json">{{ JSON.stringify(battery, null, 2) }}</pre>
  </div>
</template>
