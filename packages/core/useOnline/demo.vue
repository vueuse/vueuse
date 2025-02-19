<script setup lang="ts">
import { useOnline } from '@vueuse/core'
import { computed } from 'vue'

const online = useOnline()

const clazz = computed(() => online.value ? 'text-primary' : 'text-gray')
const text = computed(() => online.value ? 'Online' : 'Offline')
</script>

<template>
  <note class="mb-2">
    Disconnect your network to see changes
  </note>
  <div>Status: <b :class="clazz">{{ text }}</b></div>
</template>
