<script setup lang='ts'>
import { computed, ref, watch } from 'vue'
import { useUserAgent } from '.'

const ua = useUserAgent(navigator.userAgent)
</script>

<template>
  <pre>{{ ua.getResult() }}</pre>
</template>
