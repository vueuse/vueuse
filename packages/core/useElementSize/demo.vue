<script setup lang="ts">
import { yamlStringify as stringify, useElementSize } from '@vueuse/core'
import { reactive, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const size = reactive(
  useElementSize(
    el,
    { width: 0, height: 0 },
    { box: 'border-box' },
  ),
)
const text = stringify(size)
</script>

<template>
  <note class="mb-2">
    Resize the box to see changes
  </note>
  <textarea ref="el" class="resizer" v-text="text" />
</template>
