<script setup lang="ts">
import { useAdBlockerDetector } from '@vueuse/core'
import { ref } from 'vue-demi'

const hasBlockerDetector = ref(false)
useAdBlockerDetector().then(abd => hasBlockerDetector.value = abd.value)
</script>

<template>
  <p>
    Your browser {{ hasBlockerDetector ? 'has' : 'doesn\'t have' }} an activated Ad Blocker
  </p>
</template>
