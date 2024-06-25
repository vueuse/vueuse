<script setup lang="ts">
import { ref } from 'vue'
import { useElementHover } from '@vueuse/core'
import { vElementHover } from './directive'

const el = ref<HTMLButtonElement>()
const isDirectiveHovered = ref(false)
const isHovered = useElementHover(el, { delayEnter: 200, delayLeave: 600 })
function onHover(hovered: boolean) {
  isDirectiveHovered.value = hovered
}
</script>

<template>
  <button ref="el">
    <span>{{ isHovered ? 'Thank you!' : 'Hover me' }}</span>
  </button>
  <button v-element-hover="[onHover, { delayEnter: 200, delayLeave: 600 }]">
    <span>{{ isDirectiveHovered ? 'Thank you!' : 'Hover me' }}</span>
  </button>
</template>
