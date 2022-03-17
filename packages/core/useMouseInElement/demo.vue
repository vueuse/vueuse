<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { reactive, ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import Area from './Area.vue'

const target = ref(null)
const mouse = reactive(useMouseInElement(target))
const text = stringify(mouse)
</script>

<template>
  <div flex="~" gap="4">
    <Area ref="target" />
    <pre lang="yaml">{{ text }}</pre>
  </div>
</template>
