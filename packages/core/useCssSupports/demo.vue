<script setup lang="ts">
import { useCssSupports } from '@vueuse/core'

const { isSupported: textDecoration } = useCssSupports('text-decoration-style', 'blink')
const { isSupported: flex } = useCssSupports('display: flex')
const { isSupported: variable } = useCssSupports('(--foo: red)')
const { isSupported: selectorHas } = useCssSupports('selector(:has(a))')
const { isSupported: query } = useCssSupports('(transform-style: preserve) or (-moz-transform-style: preserve) or (-webkit-transform-style: preserve)')
const { isSupported: doesNotExists } = useCssSupports('doesNotExist')
</script>

<template>
  <div>
    <ul>
      <li><code>useCssSupports("text-decoration-style", "blink")</code>: {{ textDecoration }}</li>
      <li><code>useCssSupports('display: flex')</code>: {{ flex }}</li>
      <li><code>useCssSupports("(--foo: red)")</code>: {{ variable }}</li>
      <li><code>useCssSupports("selector(:has(a))")</code>: {{ selectorHas }}</li>
      <li><code>useCssSupports("(transform-style: preserve) or (-moz-transform-style: preserve) or (-webkit-transform-style: preserve)")</code>: {{ query }}</li>
      <li><code>useCssSupports("doesNotExist")</code>: {{ doesNotExists }}</li>
    </ul>
  </div>
</template>
