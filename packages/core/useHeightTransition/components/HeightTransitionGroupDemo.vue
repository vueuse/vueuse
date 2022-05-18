<script setup lang="ts">
import { computed, ref } from 'vue-demi'
import { useHeightTransition } from '@vueuse/core'
const { shrinkHeight, expandHeight } = useHeightTransition({
  duration: 500,
})

const list: { msg: string; hasAdditionalLine?: boolean }[] = [
  { msg: 'Bruce Lee' },
  { msg: 'Jackie Chan' },
  { msg: 'Chuck Norris' },
  { msg: 'Jet Li' },
  { msg: 'Kung Fury' },
]

// Randomly set some records to show additional line. However, try to have at
// least one record of each type (with and without additional line).
let count = 0
list.forEach((el) => {
  el.hasAdditionalLine = Math.random() < 0.5
  if (el.hasAdditionalLine)
    count++
})
if (count === 0)
  list[0].hasAdditionalLine = true
if (count === list.length)
  list[0].hasAdditionalLine = false

const query = ref('')
const computedList = computed(
  () => list.filter(item => item.msg.toLowerCase().includes(query.value)),
)
</script>

<template>
  <div>
    <div> Vue.js &lt;TransitionGroup&gt; demo. </div>
    <input v-model="query" border>
    <TransitionGroup
      :css="false"
      @enter="expandHeight"
      @leave="shrinkHeight"
    >
      <li
        v-for="(item, index) in computedList"
        :key="item.msg"
        :data-index="index"
      >
        {{ item.msg }}
        <div v-if="item.hasAdditionalLine" font-bold>
          additional line
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>
