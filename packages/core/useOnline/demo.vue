<script setup lang="ts">
import { ternary } from 'vue-chemistry/boolean'
import { useOnline } from '.'

const online = useOnline()

const clazz = ternary(online, 'text-primary', 'text-gray')
const text = ternary(online, 'Online', 'Offline')
</script>

<template>
  <note class="mb-2">
    Disconnet your network to see changes
  </note>
  <div>Status: <b :class="clazz">{{ text }}</b></div>
</template>
