<script setup lang="ts">
import { ref } from 'vue-demi'
import { useFocus } from '.'

const text = ref()
const input = ref()
const button = ref()

const textFocus = useFocus({ target: text })
const inputFocus = useFocus({ target: input, initialValue: true })
const buttonFocus = useFocus({ target: button })

const setTextFocus = () => { textFocus.value = true }
const setInputFocus = () => { inputFocus.value = true }
const setButtonFocus = () => { buttonFocus.value = true }
const unsetTextFocus = () => { textFocus.value = false }
const unsetInputFocus = () => { inputFocus.value = false }
const unsetButtonFocus = () => { buttonFocus.value = false }
</script>

<template>
  <div>
    <p ref="text" :class="{'bg-green-200': textFocus}">
      Some text that can be focused
    </p>
    <input ref="input" class="item" />
    <button ref="button" class="item" style="margin: 5px">
      button
    </button>
    <hr />
    <div>
      <button @click="setTextFocus">
        focus text
      </button>
      <button @click="setInputFocus">
        focus input
      </button>
      <button @click="setButtonFocus">
        focus button
      </button>
    </div>
    <div>
      <button @click="unsetTextFocus">
        unfocus text
      </button>
      <button @click="unsetInputFocus">
        unfocus input
      </button>
      <button @click="unsetButtonFocus">
        unfocus button
      </button>
    </div>
    <p v-if="textFocus">
      The text has focus
    </p>
    <p v-if="inputFocus">
      The input control has focus
    </p>
    <p v-if="buttonFocus">
      The button has focus
    </p>
  </div>
</template>

<style scoped>
.item:focus, bg {
  background-color: cadetblue;
}
</style>
