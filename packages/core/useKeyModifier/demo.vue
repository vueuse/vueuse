<script setup lang="ts">
import { useKeyModifier } from '@vueuse/core'
import { defineComponent, h } from 'vue'

const capsLock = useKeyModifier('CapsLock')
const numLock = useKeyModifier('NumLock')
const scrollLock = useKeyModifier('ScrollLock')
const shift = useKeyModifier('Shift')
const control = useKeyModifier('Control')
const alt = useKeyModifier('Alt')

const Key = defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  render() {
    return h('div', {
      class: [
        'font-mono px-4 py-2 rounded',
        this.value
          ? 'opacity-100 text-primary bg-primary bg-opacity-15'
          : 'opacity-50 bg-gray-600 bg-opacity-10 dark:(bg-gray-400 bg-opacity-10)',
      ],
    }, this.$slots.default?.())
  },
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
    <Key :value="capsLock || false">
      capsLock
    </Key>
    <Key :value="numLock || false">
      numLock
    </Key>
    <Key :value="scrollLock || false">
      scrollLock
    </Key>
    <Key :value="shift || false">
      shift
    </Key>
    <Key :value="control || false">
      control
    </Key>
    <Key :value="alt || false">
      alt
    </Key>
  </div>
</template>
