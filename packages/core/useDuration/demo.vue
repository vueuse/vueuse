<script setup lang="ts">
import { useDuration } from '@vueuse/core'

// Y --> a year
// M --> a month
// d --> a day
// h --> an hour
// w --> a week
// m --> a minute
// s --> a second
let durYear = useDuration("1Y 1M") // a year and a month later
let durYear = useDuration("-3Y")  // now the year is 2023, that result will be return 2020 Date Object
</script>

<template>
  <div>
    {{ dur }}
  </div>
</template>
