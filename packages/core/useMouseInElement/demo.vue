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

const inlineTarget = useTemplateRef<HTMLElement>('inline-target')
const inlineMouse = reactive(useMouseInElement(inlineTarget))
const inlineText = stringify(inlineMouse)
</script>

<template>
  <div flex="~" gap="4">
    <Area ref="target" />
    <pre lang="yaml">{{ text }}</pre>
  </div>

  <div flex="~" gap="4">
    <div
      class="el"
      w="40"
      h="40"
      bg="gray-400/20"
      border="rounded"
      flex="~"
      place="content-center"
      select="none"
      style="text-align: center"
    >
      <div m="auto">
        <span>
          Hover <span ref="inline-target" style="background: rgb(36, 146, 82, 0.5)">
            the highlighted text to see the</span> tracking.
        </span>
      </div>
    </div>
    <pre lang="yaml">{{ inlineText }}</pre>
  </div>
</template>
