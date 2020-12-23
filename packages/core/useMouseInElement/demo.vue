<script setup lang="ts">
import { defineComponent, reactive, ref } from 'vue-demi'
import { useMouseInElement } from '.'

const demoRef = ref(null)
const demo = demoRef,
  mouse = reactive(useMouseInElement(demoRef))
</script>

<template>
  <pre lang="json" ref="demo">{{ JSON.stringify(mouse, null, 2) }}</pre>
</template>
