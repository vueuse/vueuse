<script setup lang="ts">
import { keepAliveScope, useEventListener } from '@vueuse/core'
import { ref } from 'vue-demi'

const pointerX = ref(0)

keepAliveScope(() => {
  useEventListener('pointermove', (e) => {
    pointerX.value = e.clientX
  })
})
</script>

<template>
  <div>
    <Teleport to="body">
      <div fixed right-5 bottom-12>
        Second Component: {{ pointerX }}
      </div>
    </Teleport>
    Second component is actived!
  </div>
</template>
