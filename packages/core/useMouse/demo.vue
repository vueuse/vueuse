<script setup lang="ts">
import { reactive } from 'vue-demi'
import { stringify } from '@vueuse/docs-utils'
import { useMouse } from '.'

const mouse = reactive(useMouse())
const text = stringify(mouse)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
