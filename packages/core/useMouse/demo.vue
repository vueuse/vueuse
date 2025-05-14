<script setup lang="ts">
import type { UseMouseEventExtractor } from '@vueuse/core'
import { reactify, useMouse, useParentElement } from '@vueuse/core'
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

const parentEl = useParentElement()

const mouseDefault = reactive(useMouse())
const textDefault = stringify(mouseDefault)

const extractor: UseMouseEventExtractor = (event) => {
  if (event instanceof MouseEvent)
    return [event.offsetX, event.offsetY]
  else
    return null
}

const mouseWithExtractor = reactive(useMouse({ target: parentEl, type: extractor }))
const textWithExtractor = stringify(mouseWithExtractor)
</script>

<template>
  <p>Basic Usage</p>
  <pre lang="yaml">{{ textDefault }}</pre>
  <p>Extractor Usage</p>
  <pre lang="yaml">{{ textWithExtractor }}</pre>
</template>
