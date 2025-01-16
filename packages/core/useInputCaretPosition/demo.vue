<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useInputCaretPosition } from '..'

const input = useTemplateRef<HTMLInputElement>('input')

const { position } = useInputCaretPosition(input)

const inputValue = ref('')
</script>

<template>
  <div>
    <input ref="input" v-model="inputValue" type="text" placeholder="Type here">
    caret position: {{ position }}
  </div>
</template>
