<script setup lang="ts">
import { ref } from 'vue-demi'
import { useFocusInputElement } from '.'

const input = ref()
const textarea = ref()

const { focused: inputFocus } = useFocusInputElement({ target: input, initialValue: true })
const { focused: textFocus } = useFocusInputElement({ target: textarea })

const setInputFocus = () => { inputFocus.value = true }
const setTextFocus = () => { textFocus.value = true }
const unsetInputFocus = () => { inputFocus.value = false }
const unsetTextFocus = () => { textFocus.value = false }
</script>

<template>
  <div>
    <div ref="input">
      <input class="item" />
    </div>
    <div ref="textarea" style="padding-top: 5px">
      <textarea rows="5" class="item" />
    </div>
    <hr />
    <div>
      <button @click="setInputFocus">
        focus input
      </button>
      <button @click="setTextFocus">
        focus text area
      </button>
    </div>
    <div>
      <button @click="unsetInputFocus">
        unfocus input
      </button>
      <button @click="unsetTextFocus">
        unfocus text area
      </button>
    </div>
    <p v-if="inputFocus">
      The input control has focus
    </p>
    <p v-if="textFocus">
      The text area has focus
    </p>
  </div>
</template>

<style scoped>
.item:focus, bg {
  background-color: cadetblue;
}
</style>
