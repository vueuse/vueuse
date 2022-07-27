<script setup lang="ts">
import { useColorMode, useCycleList } from '@vueuse/core'

const { currentMode, setting } = useColorMode({
  modes: {
    contrast: 'dark contrast',
    cafe: 'cafe',
  },
}, 'state')

const { next } = useCycleList(['dark', 'light', 'cafe', 'contrast', 'auto'], { initialValue: setting })
</script>

<template>
  <div>
    <button @click="next()">
      <i v-if="setting === 'dark'" i-carbon-moon inline-block align-middle class="align-middle" />
      <i v-if="setting === 'light'" i-carbon-sun inline-block align-middle class="align-middle" />
      <i v-if="setting === 'cafe'" i-carbon-cafe inline-block align-middle class="align-middle" />
      <i v-if="setting === 'contrast'" i-carbon-contrast inline-block align-middle class="align-middle" />
      <i v-if="setting === 'auto'" i-carbon-laptop inline-block align-middle class="align-middle" />
      <span class="ml-2 capitalize">{{ setting }}</span>
    </button>
    <span class="p-4 opacity-50">← Click to change the color mode</span>
  </div>
  <div>
    <span>Current mode: {{ currentMode }}</span>
  </div>
</template>

<style>
html.cafe {
  filter: sepia(0.9) hue-rotate(315deg) brightness(0.9);
}

html.contrast {
  filter: contrast(2);
}
</style>
