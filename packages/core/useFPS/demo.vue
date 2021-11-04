<template>fps:{{ fps }}</template>

<script setup lang="ts">
import { useFPS } from './index'
const fps = useFPS({
  every: 10,
})
</script>
