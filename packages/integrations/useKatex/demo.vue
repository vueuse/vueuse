<script setup lang="ts">
import { ref } from 'vue'
import { useKatex } from '.'
import 'katex/dist/katex.min.css'

const value = ref('\\int\\limits_a^b f(x)\\,dx = F(b) - F(a)')
const rendered = useKatex(value, { displayMode: true })
</script>

<template>
  <div>
    <input v-model="value" type="text">
    <div>
      <div inline-block v-html="rendered" />
    </div>
  </div>
</template>
