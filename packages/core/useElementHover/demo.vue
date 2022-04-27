<script setup lang="ts">
import { ref } from 'vue'
import { useElementHover } from '@vueuse/core'

const el = ref()
const isHovered = useElementHover(el)
</script>

<template>
  <button ref="el">
    <span>{{ isHovered ? 'Thank you!' : 'Hover me' }}</span>
  </button>
</template>
