<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useElementSize } from '.'

const el = ref(null)
const { width, height } = useElementSize(el)

const el, width, height
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
    >
width: {{ width }}, height: {{ height }}
        </textarea
    >
  </div>
</template>
