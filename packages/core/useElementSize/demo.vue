<script setup lang="ts">
import { reactive, ref } from 'vue'
import { stringify } from '@vueuse/docs-utils'
import { useElementSize } from '@vueuse/core'

const el = ref(null)
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
