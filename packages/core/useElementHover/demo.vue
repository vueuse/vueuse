<script setup lang="ts">
import { ref } from 'vue'
import { useElementHover } from '@vueuse/core'

const el = ref<HTMLButtonElement>()
const elOptions = ref<HTMLButtonElement>()

const isHovered = useElementHover(el)
const isHoveredOptions = useElementHover(elOptions, { delay: 500 })
</script>

<template>
  <button ref="el">
    <span>{{ isHovered ? 'Thank you!' : 'Hover me' }}</span>
  </button>

  <button ref="elOptions">
    <span>{{ isHoveredOptions ? 'Thank you! (500ms)' : 'Hover me (500ms)' }}</span>
  </button>
</template>
