<script setup lang="ts">
import { defineComponent, reactive } from 'vue-demi'
import { useNetwork } from '.'

const network = reactive(useNetwork())
</script>

<template>
  <pre lang="json">{{ JSON.stringify(network, null, 2) }}</pre>
</template>
