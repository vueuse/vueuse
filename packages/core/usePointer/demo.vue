<script setup lang="ts">
import { reactive } from 'vue'
import { usePointer } from '@vueuse/core'

const pointer = reactive(usePointer())
</script>

<template>
  <pre class="select-none" style="touch-action: none">{{ pointer }}</pre>
</template>
