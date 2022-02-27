<script setup lang="ts">
import { useCycleList } from '../useCycleList'
import { useColorMode } from '.'

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
    <carbon-moon v-if="mode === 'dark'" class="align-middle" />
    <carbon-sun v-if="mode === 'light'" class="align-middle" />
    <carbon-cafe v-if="mode === 'cafe'" class="align-middle" />
    <carbon-contrast v-if="mode === 'contrast'" class="align-middle" />

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
