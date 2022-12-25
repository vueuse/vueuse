<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { ref, watch } from 'vue-demi'

const time = ref(0)

const now = useNow()
watch(now, (now) => {
  time.value = +now
})
</script>

<template>
  <div>
    <Teleport to="body">
      <div fixed right-5 bottom-5>
        First Component: {{ time }}
      </div>
    </Teleport>
    First component is actived!
  </div>
</template>
