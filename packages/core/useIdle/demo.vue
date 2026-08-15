<script setup lang="ts">
import { useIdle, useIntervalFn, useTimestamp } from '@vueuse/core'
import { computed } from 'vue'

const { idle, lastActive } = useIdle(5000)

const now = useTimestamp({ scheduler: cb => useIntervalFn(cb, 1000) })

const idledFor = computed(() => {
  const active = Math.floor((now.value - lastActive.value) / 1000)

  return active > 0 ? active : 0
})
</script>

<template>
  <note class="mb-2">
    For demonstration purpose, the idle timeout is set to <b>5s</b> in this
    demo (default 1min).
  </note>
  <div class="mb-2">
    Idle: <BooleanDisplay :value="idle" />
  </div>
  <div>Inactive: <b class="text-primary">{{ idledFor }}s</b></div>
</template>
