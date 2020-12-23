<script setup lang="ts">
import { defineComponent, reactive } from 'vue-demi'
import { useDeviceOrientation } from '.'

const orientation = reactive(
  useDeviceOrientation({
    window = window.parent,
  })
)
</script>

<template>
  <div>
    <pre lang="json"
      >{{ JSON.stringify(orientation, null, 2) }}
        </pre
    >
  </div>
</template>
