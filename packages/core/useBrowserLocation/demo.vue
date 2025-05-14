<script setup lang="ts">
import { reactify, useBrowserLocation } from '@vueuse/core'
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

const location = useBrowserLocation()
const text = stringify(location)
</script>

<template>
  Input and hash will be changed:
  <input v-model="location.hash" type="text" placeholder="Hash">
  <pre lang="yaml">{{ text }}</pre>
</template>
