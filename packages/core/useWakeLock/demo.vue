<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useWakeLock } from '@vueuse/core'

const wakeLock = reactive(useWakeLock())
const text = computed(() => wakeLock.isActive ? 'OFF' : 'ON')
const onClick = () => wakeLock.isActive ? wakeLock.request('screen') : wakeLock.release()
</script>

<template>
  <div>
    Is Supported: <BooleanDisplay :value="wakeLock.isSupported" />
  </div>
  <div>
    Is Active: <BooleanDisplay :value="wakeLock.isActive" />
  </div>
  <button @click="onClick">
    {{ text }}
  </button>
</template>
