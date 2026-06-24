<script setup lang="ts">
import { useKeybinds } from '@vueuse/core'
import { onMounted, shallowReactive, useTemplateRef } from 'vue'

const state = shallowReactive({
  action1: false,
  action2: false,
  action3: false,
})

const inputRef = useTemplateRef('input')

function reset() {
  state.action1 = false
  state.action2 = false
  state.action3 = false

  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

onMounted(() => {
  useKeybinds({
    'KeyA-KeyS': () => {
      state.action1 = true
    },
    'KeyA-KeyD': () => {
      state.action2 = true
    },
    'alt_KeyA-alt_KeyF': () => {
      state.action3 = true
    },
    'KeyT': ({ lastEvent }) => {
      lastEvent.preventDefault()
      inputRef.value?.focus()
    },
  })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col">
      <div>
        <button type="button" :disabled="state.action1" @click="state.action1 = true">
          Action 1 <span class="mx-1"><kbd>a</kbd> <kbd>s</kbd></span> <span v-if="state.action1">&check;</span>
        </button>
      </div>

      <div>
        <button type="button" :disabled="state.action2" @click="state.action2 = true">
          Action 2 <span class="mx-1"><kbd>a</kbd> <kbd>d</kbd></span> <span v-if="state.action2">&check;</span>
        </button>
      </div>

      <div>
        <button type="button" :disabled="state.action3" @click="state.action3 = true">
          Action 3 <span class="mx-1"><kbd>Alt/Option + a</kbd> <kbd>Alt/Option + f</kbd></span> <span v-if="state.action3">&check;</span>
        </button>
      </div>
    </div>

    <div>
      <label for="use-keybinds-demo">Input events are ignored by default</label>
      <input id="use-keybinds-demo" ref="input" type="text" placeholder="Press T to focus">
    </div>

    <div>
      <button @click="reset()">
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped>
kbd {
  background-color: #000;
  border-radius: 4px;
  border: 1px #ddd solid;
  color: #ddd;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  padding: 1px 4px;
  text-shadow: none;
}
</style>
