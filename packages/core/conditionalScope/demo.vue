<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'
import { conditionalScope } from '.'

const isActive = ref(true)
const pointerX = ref(0)

conditionalScope(isActive, () => {
  useEventListener('pointermove', (e) => {
    pointerX.value = e.clientX
  })
})
</script>

<template>
  <div>
    <div grid grid-cols-2>
      <label>
        <input v-model="isActive" type="checkbox">
        Active
      </label>
      <div>
        PoniterX = {{ pointerX }}
      </div>
    </div>
  </div>
</template>
