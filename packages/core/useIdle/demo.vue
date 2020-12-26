<script setup lang="ts">
import { computed } from 'vue-demi'
import { useIdle } from '.'
import { useTimestamp } from '../useTimestamp'

const { idle, lastActive } = useIdle(5000)

const { timestamp: now } = useTimestamp()

const idledFor = computed(() =>
  Math.floor((now.value - lastActive.value) / 1000),
)
</script>

<template>
  <div class="note">
    For demonstraction purpose, the idle timout is set to <b>5s</b> in this
    demo (default 1min).
  </div>
  <p>Idle: {{ idle }}</p>
  <p>Inactive: {{ idledFor }}s</p>
</template>
