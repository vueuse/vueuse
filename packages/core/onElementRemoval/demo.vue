<script setup lang="ts">
import { onElementRemoval } from '@vueuse/core'
import { ref } from 'vue'

// demo1: recreate new element
const demo1Ref = ref<HTMLElement | null>(null)
const demo1State = ref(true)
const demo1Count = ref(0)

function demo1BtnOnClick() {
  demo1State.value = !demo1State.value
}

onElementRemoval(demo1Ref, () => demo1Count.value++)

// demo2: reuse same element
const demo2ParentRef = ref<HTMLElement | null>(null)
const demo2Ref = ref<HTMLElement | null>(null)
const demo2State = ref(true)
const demo2Count = ref(0)

function demo2BtnOnClick() {
  demo2State.value = !demo2State.value
  if (demo2State.value) {
    demo2ParentRef.value?.appendChild(demo2Ref.value!)
  }
  else {
    demo2Ref.value?.remove()
  }
}

onElementRemoval(demo2Ref, () => demo2Count.value++)
</script>

<template>
  <div class="on-element-removal__demo">
    <h3>demo1: recreate new element</h3>
    <div>
      <button
        v-if="!demo1State"
        @click="demo1BtnOnClick"
      >
        recreate me
      </button>
      <button
        v-else
        ref="demo1Ref"
        class="btn"
        @click="demo1BtnOnClick"
      >
        remove me
      </button>
      <div>
        <b>removed times: {{ demo1Count }}</b>
      </div>
    </div>

    <hr>

    <h3>demo2: reuse same element</h3>
    <button
      :class="{ btn: demo2State }"
      @click="demo2BtnOnClick"
    >
      {{ demo2State ? 'remove' : 'append' }} me
    </button>
    <span ref="demo2ParentRef">
      <span ref="demo2Ref">
        target element
      </span>
    </span>
    <div>
      <b>removed times: {{ demo2Count }}</b>
    </div>
  </div>
</template>

<style lang="postcss">
.on-element-removal__demo .btn {
  @apply bg-red-400;
}

.on-element-removal__demo .btn:hover {
  @apply bg-red-500;
}
</style>
