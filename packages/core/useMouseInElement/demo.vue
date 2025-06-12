<script setup lang="ts">
import { reactify, useMouseInElement } from '@vueuse/core'
import { reactive, useTemplateRef } from 'vue'
import YAML from 'yaml'
import Area from './Area.vue'

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

const target = useTemplateRef<HTMLElement>('target')
const mouse = reactive(useMouseInElement(target))
const text = stringify(mouse)
</script>

<template>
  <div flex="~" gap="4">
    <Area ref="target" />
    <pre lang="yaml">{{ text }}</pre>
  </div>
</template>
