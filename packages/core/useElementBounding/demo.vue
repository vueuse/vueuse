<script setup lang="ts">
import { stringify, useElementBounding } from '@vueuse/core'
import { reactive, useTemplateRef } from 'vue'

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
