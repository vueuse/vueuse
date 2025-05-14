<script setup lang="ts">
import { reactify, useMediaQuery } from '@vueuse/core'
import { computed, reactive } from 'vue'
import YAML from 'yaml'

const stringify = reactify(
  (input: any) => YAML.stringify(input, (k, v) => {
    if (typeof v === 'function') {
      return undefined
    }
    return v
  }, {
    singleQuote: true,
    flowCollectionPadding: false,
  }),
)

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

const code = computed(() => stringify(reactive({
  isLargeScreen,
  prefersDark,
})))
</script>

<template>
  <pre lang="json">{{ code }}</pre>
</template>
