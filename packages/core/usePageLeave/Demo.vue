<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { usePageLeave } from '.'

const isLeft = usePageLeave({
  window = window.parent,
})
</script>

<template>
  <div>
    <pre lang="json">{{ { isLeft } }}</pre>
  </div>
</template>
