<script setup lang="ts">
import { reactive } from 'vue'
import { stringify } from '@vueuse/docs-utils'
import { type UseMouseExtractFn, useMouse, useParentElement } from '@vueuse/core'

const parentEl = useParentElement()

const mouseDefault = reactive(useMouse())
const textDefault = stringify(mouseDefault)

const extractor: UseMouseExtractFn = event => (
  event instanceof Touch
    ? null
    : { x: event.offsetX, y: event.offsetY }
)

const mouseWithExtractor = reactive(useMouse({ target: parentEl, type: extractor }))
const textWithExtractor = stringify(mouseWithExtractor)
</script>

<template>
  <p>Basic Usage</p>
  <pre lang="yaml">{{ textDefault }}</pre>
  <p>Extractor Usage</p>
  <pre lang="yaml">{{ textWithExtractor }}</pre>
</template>
