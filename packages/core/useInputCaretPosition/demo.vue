<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useInputCaretPosition } from '..'

const input = useTemplateRef<HTMLInputElement>('input')

const { position } = useInputCaretPosition(input)

const inputValue = shallowRef('')
</script>

<template>
  <div>
    <input ref="input" v-model="inputValue" type="text" placeholder="Type here">
    caret position: {{ position }}
  </div>
</template>
