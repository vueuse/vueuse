<script setup lang="ts">
import { useHeightTransition } from '@vueuse/core'
import { ref, watch } from 'vue-demi'

const { shrinkHeight, expandHeight } = useHeightTransition()
const show = ref(false)

const el = ref<HTMLDivElement | null>(null)

watch(show, () => {
  console.log(show.value)
  // console.log(el.value)
  // (el.value)
  if (show)
    expandHeight(el.value)
  else
    shrinkHeight(el.value)
})
</script>

<template>
  <div>
    <button @click="show = !show">
      Toggle
    </button>
    <Transition :css="false" @enter="expandHeight" @leave="shrinkHeight">
      <p v-if="show">
        hello
      </p>
    </Transition>
    <p>separator text</p>
    <p ref="el">
      Some text to show transition
    </p>
    <p>separator text</p>
    <!-- <button @click="inc()">
      Increment
    </button>
    <button @click="dec()">
      Decrement
    </button> -->
  </div>
</template>
