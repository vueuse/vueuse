<script setup lang="ts">
import { shallowRef, Ref } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'
import { useColorMode } from './index'

const mode = useColorMode({
  modes: {
    contrast: 'dark contrast',
    cafe: 'cafe',
  },
})

function useCycleList<T>(list: T[], init: MaybeRef<T> = list[0]) {
  const state = shallowRef(init) as Ref<T>

  function shift(delta = 1) {
    const index = list.indexOf(state.value)
    const value = list[((index + delta) % list.length + list.length) % list.length]
    state.value = value
    return value
  }

  function next() {
    return shift(1)
  }

  function prev() {
    return shift(-1)
  }

  return {
    state,
    next,
    prev,
  }
}

const { next } = useCycleList(['light', 'dark', 'cafe', 'contrast'], mode)
</script>

<template>
  <button @click="next()">
    <carbon-moon v-show="mode === 'dark'" class="align-middle" />
    <carbon-sun v-show="mode === 'light'" class="align-middle" />
    <carbon-cafe v-show="mode === 'cafe'" class="align-middle" />
    <carbon-contrast v-show="mode === 'contrast'" class="align-middle" />

    <span class="ml-2 capitalize">{{ mode }}</span>
  </button>
</template>

<style>
html.cafe {
  filter: sepia(0.9) hue-rotate(315deg) brightness(0.9);
}

html.contrast {
  filter: contrast(2);
}
</style>
