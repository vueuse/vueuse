<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { computed, defineComponent, h } from 'vue'

const { shift, v, u, e, s, v_u_e, u_s_e, current } = useMagicKeys()
const keys = computed(() => Array.from(current))

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
  <div class="flex flex-col md:flex-row">
    <img
      src="/vue.svg"
      class="h-38 py-8 m-auto transform transition duration-500"
      :class="{ 'opacity-0': !v_u_e, 'rotate-180': shift }"
    >

    <div>
      <note class="text-center mt-0 mb-5">
        Press the following keys to test out
      </note>
      <div class="flex gap-3 justify-center">
        <Key :value="v">
          V
        </Key>
        <Key :value="u">
          u
        </Key>
        <Key :value="e">
          e
        </Key>
        <div class="mx-1" />
        <Key :value="u">
          U
        </Key>
        <Key :value="s">
          s
        </Key>
        <Key :value="e">
          e
        </Key>
      </div>

      <div class="flex gap-3 justify-center mt-3">
        <Key :value="shift">
          Shift
        </Key>
        <Key :value="v_u_e">
          Vue
        </Key>
        <Key :value="u_s_e">
          Use
        </Key>
      </div>

      <div class="text-center mt-4">
        <Note>Keys Pressed</Note>
        <div class="flex mt-2 justify-center space-x-1 min-h-1.5em">
          <code
            v-for="key in keys"
            :key="key"
            class="font-mono"
          >
            {{ key }}
          </code>
        </div>
      </div>
    </div>

    <img
      src="/favicon.svg"
      class="h-38 py-8 m-auto transform transition duration-500"
      :class="{ 'opacity-0': !u_s_e, 'rotate-180': shift }"
    >
  </div>
</template>
