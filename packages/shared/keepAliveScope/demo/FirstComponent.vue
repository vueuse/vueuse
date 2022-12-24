<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue-demi'

const pointerX = ref(0)

useEventListener('pointermove', (e) => {
  pointerX.value = e.clientX
})
</script>

<template>
  <div>
    <Teleport to="body">
      <div fixed right-5 bottom-5>
        First Component: {{ pointerX }}
      </div>
    </Teleport>
    First component is actived!
  </div>
</template>
