<script setup lang="ts">
import { ref } from 'vue-demi'
import HeightTransitionDemo from './components/HeightTransitionDemo.vue'
import HeightTransitionGroupDemo from './components/HeightTransitionGroupDemo.vue'
import HeightTransition from './components/HeightTransition.vue'

const demoOptions = [
  'basic',
  'Transition',
  'TransitionGroup',
  'Transition',
  'empty']
const demoChoice = ref(0)

const modeOptions = ['', 'out-in', 'in-out']
const modeChoice = ref(2)
</script>

<template>
  <div text-xs>
    Current demo settings:
    <span font-mono>
      demo='{{ demoOptions[demoChoice] }}',
      mode='{{ modeOptions[modeChoice] ? modeOptions[modeChoice] : "default" }}
    </span>'
  </div>

  <div>
    <button @click="demoChoice = (demoChoice + 1) % demoOptions.length">
      Next demo
    </button>
    <button @click="modeChoice = (modeChoice + 1) % modeOptions.length">
      Next mode
    </button>
  </div>

  <HeightTransition :mode="modeOptions[modeChoice]">
    <HeightTransitionGroupDemo v-if="demoOptions[demoChoice] === 'TransitionGroup'" />
    <HeightTransitionDemo v-if="demoOptions[demoChoice] === 'Transition'" />
    <div v-if="demoOptions[demoChoice] === 'basic'">
      Basic &lt;div&gt; demo. Note height transition of demo section on "Next demo" button click.
    </div>
  </HeightTransition>
</template>
