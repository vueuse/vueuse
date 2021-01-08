<script setup lang="ts">
import { reactive, ref } from 'vue-demi'
import { stringify } from 'vue-chemistry/json'
import { useElementBounding } from '.'

const el = ref(null)
const rect = reactive(useElementBounding(el))
const text = stringify(rect, null, 2)
</script>

<template>
  <div style="min-height: 300px">
    <note class="mb-2">
      Resize the box to see changes
    </note>
    <textarea ref="el" readonly class="resizer" :value="text" />
  </div>
</template>
