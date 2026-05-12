<script setup lang="ts">
import { vElementHover } from '@vueuse/components'
import { useElementHover } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const isDirectiveHovered = shallowRef(false)
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
