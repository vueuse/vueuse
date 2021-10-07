<script setup lang="ts">
import { ref } from 'vue-demi'
import { useElementHover } from '.'

const el = ref()
const isHovered = useElementHover(el)
</script>

<template>
  <button ref="el">
    <span>Hover me!</span>
  </button>
  {{ isHovered }}
</template>
