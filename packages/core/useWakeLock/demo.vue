<script setup lang="ts">
import { computed, reactive } from 'vue-demi'
import { useWakeLock } from '.'

const wakeLock = reactive(useWakeLock())
const text = computed(() => wakeLock.isActive ? 'OFF' : 'ON')
const onClick = () => wakeLock.isActive ? wakeLock.request('screen') : wakeLock.release()
</script>

<template>
  <button @click="onClick">
    {{ text }}
  </button>
</template>
