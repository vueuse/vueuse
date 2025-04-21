<script setup lang="ts">
import { useScrollParent } from '@vueuse/core'
import { useTemplateRef, watchEffect } from 'vue'

const scrollEl = useTemplateRef('el')
const scrollParent = useScrollParent(scrollEl)

watchEffect(() => {
  console.log(scrollParent.value)
})
</script>

<template>
  <div v-if="scrollParent" class="res">
    {{ scrollParent.nodeName }}
  </div>
  <div class="flex overflow-auto h-100px">
    <div ref="el" class="content">
      <p>1</p>
      <p>2</p>
      <p>3</p>
      <p>4</p>
      <p>5</p>
      <p>6</p>
      <p>7</p>
      <p>8</p>
      <p>9</p>
      <p>10</p>
    </div>
  </div>
</template>
