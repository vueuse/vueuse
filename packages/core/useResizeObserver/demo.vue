<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useResizeObserver } from '.'

const el = ref(null)
const text = ref('')

useResizeObserver(el, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  text.value = `width: ${width}, height: ${height}`
})

const el, text
</script>

<template>
  <div>
    <textarea
      ref="el"
      style="
        resize: both;
        background: transparent;
        padding: 10px;
        border: 1px solid #ffffff33;
        width: 300px;
      "
      disabled
      >{{ text }}
        </textarea
    >
  </div>
</template>
