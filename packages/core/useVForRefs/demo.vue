
<template>
  <button @click="push">
    Push
  </button>
  <button @click="pop">
    Pop
  </button>
  <button @click="shift">
    Shift
  </button>
  <button @click="unshift">
    Unshift
  </button>
  <button @click="shuffle">
    Shuffle
  </button>
  <br>

  <note>Open console to see <code>refs</code></note>
  <br>
  <template v-for="item in list" :key="item.timestamp">
    <div :ref="setRef">
      {{ item.value }}
    </div>
  </template>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, nextTick, toRaw } from 'vue-demi'
import { useVForRefs } from '@vueuse/core'

const list = reactive<ReturnType<typeof generateItem>[]>([])
const { refs, setRef } = useVForRefs()

function generateItem() {
  return {
    timestamp: Date.now(),
    value: Math.floor(Math.random() * 100),
  }
}
const push = () => list.push(generateItem())
const pop = () => list.pop()
const shift = () => list.shift()
const unshift = () => list.unshift(generateItem())
const shuffle = () => {
  const keys = [...list.keys()]
  for (const i of keys) {
    const j = Math.floor(Math.random() * keys.length)
;[list[i], list[j]] = [list[j], list[i]]
  }
}

setTimeout(push, 1)
setTimeout(push, 1)
setTimeout(push, 1)
onMounted(() => {
  console.log(toRaw(refs)) // the <div> elements
})
watch(
  () => list,
  () => {
    nextTick(() => {
      console.log(toRaw(refs))
    })
  },
  { deep: true },
)
</script>
