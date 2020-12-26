<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { useMouseInElement } from '.'

const demo = ref(null)
const mouse = reactive(useMouseInElement(demo))
</script>

<template>
  <pre ref="demo" lang="json">{{ JSON.stringify(mouse, null, 2) }}</pre>
</template>
