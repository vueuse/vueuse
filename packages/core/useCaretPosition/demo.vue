<script setup lang="ts">
import { shallowRef } from 'vue'
import { useCaretPosition } from '.'
import { useIntervalFn } from '..'

const input = shallowRef<HTMLInputElement>()

const { position } = useCaretPosition(input)

const { pause, resume, isActive } = useIntervalFn(() => {
  position.value += 1
}, 1000000)
</script>

<template>
  <div>
    <input ref="input" value="vueuse is great" type="text" placeholder="Type here">
    caret position: {{ position }}
    <button v-if="isActive" @click="pause">
      Pause Inc
    </button>
    <button v-if="!isActive" @click="resume">
      Resume Inc
    </button>
  </div>
</template>
