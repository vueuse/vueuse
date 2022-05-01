<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { useCycleList } from '../useCycleList'

const mode = useColorMode({
  modes: {
    contrast: 'dark contrast',
    cafe: 'cafe',
  },
})

const { next } = useCycleList(['dark', 'light', 'cafe', 'contrast'], { initialValue: mode })
</script>

<template>
  <button @click="next()">
    <i v-if="mode === 'dark'" i-carbon-moon inline-block align-middle class="align-middle" />
    <i v-if="mode === 'light'" i-carbon-sun inline-block align-middle class="align-middle" />
    <i v-if="mode === 'cafe'" i-carbon-cafe inline-block align-middle class="align-middle" />
    <i v-if="mode === 'contrast'" i-carbon-contrast inline-block align-middle class="align-middle" />

    <span class="ml-2 capitalize">{{ mode }}</span>
  </button>

  <span class="p-4 opacity-50">← Click to change the color mode</span>
</template>

<style>
html.cafe {
  filter: sepia(0.9) hue-rotate(315deg) brightness(0.9);
}

html.contrast {
  filter: contrast(2);
}
</style>
