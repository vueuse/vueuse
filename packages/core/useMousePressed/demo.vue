<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import { useToggle } from '@vueuse/shared'
import { computed, reactive, ref } from 'vue'
import { useMousePressed } from '@vueuse/core'

const el = ref<HTMLElement | null>()
const [withTarget, toggle] = useToggle()
const target = computed<HTMLElement | null>(() =>
  (withTarget.value ? el.value : window) as HTMLElement,
)

const mouse = reactive(useMousePressed({ target }))
const text = stringify(mouse)
</script>

<template>
  <div ref="el" class="select-none">
    <pre lang="yaml">{{ text }}</pre>
    <div>
      Tracking on
      <button class="ml-2 button small" @click="toggle()">
        {{ withTarget ? 'Demo section' : 'Entire page' }}
      </button>
    </div>
  </div>
</template>
