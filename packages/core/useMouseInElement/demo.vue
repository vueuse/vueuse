<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { reactive, ref } from 'vue-demi'
import Area from './Area.vue'
import { useMouseInElement } from '.'

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
