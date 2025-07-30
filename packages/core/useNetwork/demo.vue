<script setup lang="ts">
import { stringify, useNetwork } from '@vueuse/core'
import { reactive } from 'vue'

const network = reactive(useNetwork())
const text = stringify(network)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
