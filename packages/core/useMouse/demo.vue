<script setup lang="ts">
import { reactive } from 'vue'
import { stringify } from '@vueuse/docs-utils'
import { useMouse, useParentElement } from '@vueuse/core'
import type { UseMouseEventExtractor } from '@vueuse/core'

const parentEl = useParentElement()

const mouseDefault = reactive(useMouse())
const textDefault = stringify(mouseDefault)

const extractor: UseMouseEventExtractor = event => (event instanceof Touch
  ? null
  : [event.offsetX, event.offsetY]
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
