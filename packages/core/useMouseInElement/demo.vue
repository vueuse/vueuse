<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core'
import { stringify } from '@vueuse/docs-utils'
import { ref as deepRef, reactive } from 'vue'
import Area from './Area.vue'

const target = deepRef(null)
const mouse = reactive(useMouseInElement(target))
const text = stringify(mouse)
</script>

<template>
  <div flex="~" gap="4">
    <Area ref="target" />
    <pre lang="yaml">{{ text }}</pre>
  </div>
</template>
