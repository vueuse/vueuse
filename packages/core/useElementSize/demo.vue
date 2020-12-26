<script setup lang="ts">
import { ref } from 'vue-demi'
import { useElementSize } from '.'

const el = ref(null)
const { width, height } = useElementSize(el)
</script>

<template>
  <pre>
    width: {{ width }}
    height: {{ height }}
  </pre>
  <textarea ref="el" disabled />
</template>

<style scoped>
textarea {
  resize: both;
  background: transparent;
  padding: 10px;
  border: 1px solid #ffffff33;
  width: 300px;
}
</style>
