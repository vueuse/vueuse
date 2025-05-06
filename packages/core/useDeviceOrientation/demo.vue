<script setup lang="ts">
import { reactify, useDeviceOrientation } from '@vueuse/core'
import { reactive } from 'vue'
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

const orientation = reactive(useDeviceOrientation())
const text = stringify(orientation)
</script>

<template>
  <pre lang="yaml">{{ text }}</pre>
</template>
