<script setup lang="ts">
import { reactive } from 'vue'
import { stringify } from '@vueuse/docs-utils'
import { useMouse } from '@vueuse/core'

const mouse = reactive(useMouse())
const text = stringify(mouse)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
