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

const target = useTemplateRef('target')
const mouse = reactive(useMouseInElement(target))
const text = stringify(mouse)

const inlineTarget = useTemplateRef<HTMLElement>('inline-target')
const inlineMouse = reactive(useMouseInElement(inlineTarget))
const inlineText = stringify(inlineMouse)
</script>

<template>
  <div flex="~" items="center" gap="4">
    <Area ref="target">
      Hover me
    </Area>
    <pre lang="yaml">{{ text }}</pre>
  </div>

  <div flex="~" items="center" gap="4">
    <Area>
      <span
        ref="inline-target"
        leading="loose"
        bg="primary/30"
      >
        Hover me, I'm an inline element
      </span>
    </Area>
    <pre lang="yaml">{{ inlineText }}</pre>
  </div>
</template>
