<script setup lang="ts">
import { useWindowSize, usePreferredColorScheme } from '@vueuse/core'
import { ref, onMounted, reactive } from 'vue'

const mounted = ref(false)
const { width, height } = useWindowSize()
const color = usePreferredColorScheme()

onMounted(() => {
  mounted.value = true
})

const state = reactive({ width, height, color })
</script>

<template>
  <div>{{ state }}</div>
  <div>{{ { mounted } }}</div>
</template>
