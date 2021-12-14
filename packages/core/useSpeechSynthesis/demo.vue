<script setup lang="ts">
import { ref } from 'vue-demi'
import { useSpeechSynthesis } from '.'

const lang = ref('en-US')
const text = ref('Hello, everyone! Good morning!')

const speech = useSpeechSynthesis(text, {
  lang,
})

console.log(speech.isPlaying.value)

let synth: SpeechSynthesis

const voices = ref<SpeechSynthesisVoice[]>([])

if (speech.isSupported) {
  // load at last
  setTimeout(() => {
    synth = window.speechSynthesis
    voices.value = synth.getVoices()
  })
}

const play = () => {
  if (speech.status.value === 'pause') {
    console.log('resume')
    window.speechSynthesis.resume()
  }
  else {
    speech.speak()
  }
}

const pause = () => {
  window.speechSynthesis.pause()
}

const stop = () => {
  window.speechSynthesis.cancel()
}
</script>

<template>
  <div>
    <div v-if="!speech.isSupported">
      Your browser does not support SpeechSynthesis API,
      <a
        href="https://caniuse.com/mdn-api_speechsynthesis"
        target="_blank"
      >more details</a>
    </div>
    <div v-else>
      <label class="font-bold mr-2">Spoken Text</label>
      <input v-model="text" class="!inline-block" type="text">

      <br>
      <label class="font-bold mr-2">Language</label>
      <select v-model="lang" class="ml-5 border h-9 w-50 outline-none">
        <option disabled>
          Select Language
        </option>
        <option
          v-for="(voice, i) in voices"
          :key="i"
          :value="voice.lang"
        >
          {{ `${voice.name} (${voice.lang})` }}
        </option>
      </select>

      <div class="mt-2">
        <button
          :disabled="speech.isPlaying.value"
          @click="play"
        >
          {{ speech.status.value === 'pause' ? 'Resume' : 'Speak' }}
        </button>
        <button :disabled="!speech.isPlaying.value" class="orange" @click="pause">
          Pause
        </button>
        <button :disabled="!speech.isPlaying.value" class="red" @click="stop">
          Stop
        </button>
      </div>
    </div>
  </div>
</template>
