<script setup lang="ts">
import { useHasHydrated } from '@vueuse/shared'
import { defineComponent } from 'vue'

const SSRSafeWindowWidth = defineComponent({
  setup() {
    const hasHydrated = useHasHydrated()
    return () => hasHydrated.value ? window.innerWidth : 600
  },
})
</script>

<template>
  <SSRSafeWindowWidth />
</template>
