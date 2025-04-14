<script setup lang="ts">
import { useNetwork } from '@vueuse/core'
import { stringify } from '@vueuse/internal-docs-utils'
import { reactive } from 'vue'

const network = reactive(useNetwork())
const text = stringify(network)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
