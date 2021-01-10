<script setup lang="ts">
import { reactive } from 'vue-demi'
import { useMouse } from '.'

const mouse = reactive(useMouse())
</script>

<template>
  <pre lang="json">{{ JSON.stringify(mouse, null, 2) }}</pre>
</template>
