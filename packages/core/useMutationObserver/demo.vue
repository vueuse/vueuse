<script setup lang="ts">
import { useMutationObserver } from '@vueuse/core'
import { ref as deepRef, shallowRef, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const messages = deepRef<string[]>([])
const className = shallowRef({})
const style = shallowRef({})

useMutationObserver(
  el,
  (mutations) => {
    const mutation = mutations[0]

    if (!mutation)
      return

    messages.value.push(mutation.attributeName!)
  },
  { attributes: true },
)

setTimeout(() => {
  className.value = {
    test: true,
    test2: true,
  }
}, 1000)

setTimeout(() => {
  style.value = {
    color: 'red',
  }
}, 1550)
</script>

<template>
  <div>
    <div ref="el" :class="className" :style="style">
      <div v-for="(text, index) of messages" :key="index">
        Mutation Attribute: {{ text }}
      </div>
    </div>
  </div>
</template>
