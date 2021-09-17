<script setup lang="ts">
import { reactive } from 'vue-demi'
import { stringify } from '@vueuse/docs-utils'
import { usePointer } from '.'

const pointer = reactive(usePointer())
</script>

<template>
  <pre class="select-none" style="touch-action: none">{{ pointer }}</pre>
</template>
