---
category: Sensors
---

# onElementRemoval

Fires when the element or any element containing it is removed.

## Usage

```vue {13}
<script setup lang="ts">
import { onElementRemoval } from '@vueuse/core'
import { ref } from 'vue'

const btnRef = ref<HTMLElement | null>(null)
const btnState = ref(true)
const removedCount = ref(0)

function btnOnClick() {
  btnState.value = !btnState.value
}

onElementRemoval(btnRef, () => ++removedCount.value)
</script>

<template>
  <button
    v-if="btnState"
    @click="btnOnClick"
  >
    recreate me
  </button>
  <button
    v-else
    ref="btnRef"
    @click="btnOnClick"
  >
    remove me
  </button>
  <b>removed times: {{ removedCount }}</b>
</template>
```
