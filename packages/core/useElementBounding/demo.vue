<script setup lang="ts">
import { reactify, useElementBounding } from '@vueuse/core'
import { reactive, useTemplateRef } from 'vue'
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

const el = useTemplateRef('el')
const rect = reactive(useElementBounding(el))
const text = stringify(rect)
</script>

<template>
  <div style="min-height: 300px">
    <note class="mb-2">
      Resize the box to see changes
    </note>
    <textarea ref="el" readonly class="resizer" :value="text" />
  </div>
</template>
