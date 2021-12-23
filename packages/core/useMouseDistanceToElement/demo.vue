<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { reactive, ref } from 'vue-demi'
import CompA from './compA.vue'
import { useMouseDistanceToElement } from '.'

const target = ref(null)
const mouse = reactive(useMouseDistanceToElement(target))
const text = stringify(mouse)
</script>

<template>
  <CompA ref="target" />
  <pre lang="yaml">{{ text }}</pre>
</template>
