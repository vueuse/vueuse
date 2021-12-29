<script setup lang="ts">
import { useMounted } from '.'

const isMounted = useMounted()
</script>

<template>
  <div>{{ isMounted ? 'mounted' : 'unmounted' }}</div>
</template>
