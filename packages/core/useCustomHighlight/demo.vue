<script setup lang="ts">
import { ref } from 'vue'
import { useCustomHighlight } from '@vueuse/core'

const el = ref<HTMLElement>()
const word = ref('')
const { isSupported } = useCustomHighlight(el, word, {
  name: 'custom-highlight-name',
})
</script>

<template>
  <p v-if="!isSupported">
    CSS Custom Highlight API is not supported.
  </p>
  <input v-model="word" type="text">
  <p ref="el">
    <span text="8">L</span>orem ipsum dolor <sup>sit</sup>, amet <span underline="~ offset-4">consectetur</span> <strong>adipisicing</strong> elit. <span text="blue">Unde adipisci quisquam error</span>. Porro impedit <code>similique eaque</code>, odio eum <ruby>praesentium<rt text="3">sequi</rt></ruby> alias <del>autem officia aut</del> maiores <em>molestiae est dolore blanditiis laudantium</em>.
  </p>
</template>

<style>
::highlight(custom-highlight-name) {
  color: red;
}
</style>
