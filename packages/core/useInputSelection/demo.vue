<script setup lang="ts">
import { reactify } from '@vueuse/core'
import { reactive, shallowRef, useTemplateRef } from 'vue'
import YAML from 'yaml'
import { useInputSelection } from '.'

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

const input = useTemplateRef('input')
const textarea = useTemplateRef('textarea')

const { start, end, direction } = useInputSelection(input)
const selectionTextarea = reactive(useInputSelection(textarea))

const value = shallowRef('VueUse is cool')

const text = stringify(reactive({ start, end, direction }))
const textTextarea = stringify(selectionTextarea)

function selectFirst() {
  input.value?.focus()
  start.value = 0
  end.value = 5
}
</script>

<template>
  <div>
    <input ref="input" v-model="value" type="text" placeholder="Type here">
    <button @click.prevent="() => selectFirst()">
      select first 5
    </button>
    <pre lang="yaml">{{ text }}</pre>
    <textarea ref="textarea" v-model="value" type="text" placeholder="Type here" />
    <pre lang="yaml">{{ textTextarea }}</pre>
  </div>
</template>
