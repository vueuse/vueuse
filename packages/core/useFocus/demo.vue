<script setup lang="ts">
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'

const text = ref()
const input = ref()
const button = ref()

const { focused: paragraphFocus } = useFocus(text)
const { focused: inputFocus } = useFocus(input, { initialValue: true })
const { focused: buttonFocus } = useFocus(button)
</script>

<template>
  <div>
    <p ref="text" class="demo-el px-2 rounded" tabindex="0">
      Paragraph that can be focused
    </p>
    <input ref="input" class="demo-el" type="text" placeholder="Input that can be focused">
    <button ref="button" class="demo-el button">
      Button that can be focused
    </button>
    <hr>
    <note class="mb-2">
      <template v-if="paragraphFocus">
        The paragraph has focus
      </template>
      <template v-else-if="inputFocus">
        The input control has focus
      </template>
      <template v-else-if="buttonFocus">
        The button has focus
      </template>
      <template v-else>
        &nbsp;<!-- prevents paragraph from collapsing when empty otherwise -->
      </template>
    </note>
    <button class="button small !ml-0" :class="{ orange: paragraphFocus }" @click="paragraphFocus = !paragraphFocus">
      Focus text
    </button>
    <button class="button small" :class="{ orange: inputFocus }" @click="inputFocus = !inputFocus">
      Focus input
    </button>
    <button class="button small" :class="{ orange: buttonFocus }" @click="buttonFocus = !buttonFocus">
      Focus button
    </button>
  </div>
</template>

<style scoped>
.demo-el:focus {
  opacity: .7;
  box-shadow: 0 0 2px 1px var(--c-brand);
}
</style>
