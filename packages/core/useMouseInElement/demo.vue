<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { reactive, ref } from 'vue-demi'
import { useMouseInElement } from '.'

const demo = ref(null)
const mouse = reactive(useMouseInElement(demo))
const tesxt = stringify(mouse)
</script>

<template>
  <pre ref="demo" lang="yaml">{{ text }}</pre>
</template>
