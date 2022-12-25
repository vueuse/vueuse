<script setup lang="ts">
import { keepAliveScope, useNow } from '@vueuse/core'
import { ref, watch } from 'vue-demi'

const time = ref(0)

keepAliveScope(() => {
  const now = useNow()
  watch(now, (now) => {
    time.value = +now
  })
})
</script>

<template>
  <div>
    <Teleport to="body">
      <div fixed right-5 bottom-12>
        Second Component: {{ time }}
      </div>
    </Teleport>
    Second component is actived!
  </div>
</template>
