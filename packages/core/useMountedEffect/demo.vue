<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { onMountedEffect } from '@vueuse/core'

const childVisible = ref(true)

function onToggle() {
  childVisible.value = !childVisible.value
}

const Child = defineComponent({
  setup() {
    onMountedEffect(() => {
      console.log('mounted')

      return () => {
        console.log('beforeUnmount')
      }
    })
  },
  render() {
    return h('div', null, 'child')
  },
})
</script>

<template>
  <button @click="onToggle()">
    toggle child
  </button>
  <Child v-if="childVisible" />
</template>
