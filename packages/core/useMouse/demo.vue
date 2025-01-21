<script setup lang="ts">
import type { UseMouseEventExtractor } from '@vueuse/core'
import { useMouse, useParentElement } from '@vueuse/core'
import { stringify } from '@vueuse/docs-utils'
import { reactive } from 'vue'

const parentEl = useParentElement()

const mouseDefault = reactive(useMouse())
const textDefault = stringify(mouseDefault)

const extractor: UseMouseEventExtractor = (e) => {
  if (typeof Touch !== 'undefined' && e instanceof Touch)
    return null
  const event = e as MouseEvent
  return [event.offsetX, event.offsetY]
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
