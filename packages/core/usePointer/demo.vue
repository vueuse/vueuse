<script setup lang="ts">
import { usePointer } from '@vueuse/core'
import { reactive } from 'vue'

const pointer = reactive(usePointer())
</script>

<template>
  <pre class="select-none" style="touch-action: none">{{ pointer }}</pre>
</template>
