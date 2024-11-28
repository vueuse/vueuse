<script setup lang="ts">
import { useWakeLock } from '@vueuse/core'
import { computed, reactive } from 'vue'

const wakeLock = reactive(useWakeLock())
const text = computed(() => wakeLock.isActive ? 'OFF' : 'ON')
function onClick() {
  return wakeLock.isActive ? wakeLock.release() : wakeLock.request('screen')
}
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
