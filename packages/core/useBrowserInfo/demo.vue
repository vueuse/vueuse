<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useBrowserInfo } from '@vueuse/core'

const browserInfo = useBrowserInfo()

const info = stringify(browserInfo)
</script>

<template>
  <pre>{{ info }}</pre>
</template>
