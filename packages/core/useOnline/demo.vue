<script setup lang="ts">
import { useOnline } from '.'

const online = useOnline()
</script>

<template>
  <p>{{ online ? 'Online' : 'Offline' }}</p>
</template>
