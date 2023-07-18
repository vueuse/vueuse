<script setup lang="ts">
import { type Ref, ref } from 'vue-demi'
import { useMasonry } from '.'

const list = [
  'https://iph.href.lu/300x200',
  'https://iph.href.lu/200x300',
  'https://iph.href.lu/300x200',
  'https://iph.href.lu/180x320',
  'https://iph.href.lu/300x200',
  'https://iph.href.lu/200x300',
  'https://iph.href.lu/200x300',
  'https://iph.href.lu/300x200',
  'https://iph.href.lu/200x300',
  'https://iph.href.lu/180x320',
]

const containerRef: Ref<HTMLElement | null> = ref(null)

const { redraw } = useMasonry(
  containerRef,
  { itemSelector: '.items', columnWidth: 200 },
)
</script>

<template>
  <div ref="containerRef" style="min-height: 500px;overflow-y: scroll;">
    <img v-for="i, idx in list" :key="idx" :src="i" class="items" style="width: 30%;margin-top: 16px;" @load="redraw">
  </div>
  <button @click="redraw">
    redraw
  </button>
</template>

<style scoped></style>
