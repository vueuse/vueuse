<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { reactive, ref, useTemplateRef } from 'vue'
import { useInputSelection } from '.'

const input = useTemplateRef('input')
const textarea = useTemplateRef('textarea')

const { start, end, direction } = useInputSelection(input)
const selectionTextarea = reactive(useInputSelection(textarea))

const value = ref('VueUse is cool')

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
