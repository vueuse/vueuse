<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { stringify } from 'vue-chemistry/json'
import { useElementSize } from '.'

const el = ref(null)
const size = reactive(useElementSize(el))
const text = stringify(size, null, 2)
</script>

<template>
  <note class="mb-2">
    Resize the box to see changes
  </note>
  <textarea ref="el" class="resizer" v-text="text" />
</template>
