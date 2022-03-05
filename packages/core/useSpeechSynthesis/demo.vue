<script setup lang="ts">
import { ref } from 'vue-demi'
import { useSpeechSynthesis } from '.'

const lang = ref('en-US')
const text = ref('Hello, everyone! Good morning!')

const speech = useSpeechSynthesis(text, {
  lang,
})

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
      <div bg="$vt-c-bg" border="$vt-c-divider-light 1" inline-flex items-center relative rounded>
        <carbon-language absolute left-2 opacity-80 pointer-events-none />
        <select v-model="lang" px-8 border-0 bg-transparent h-9 rounded appearance-none>
          <option bg="$vt-c-bg" disabled>
            Select Language
          </option>
          <option
            v-for="(voice, i) in voices"
            :key="i"
            bg="$vt-c-bg"
            :value="voice.lang"
          >
            {{ `${voice.name} (${voice.lang})` }}
          </option>
        </select>
        <carbon-chevron-down absolute right-2 opacity-80 pointer-events-none />
      </div>

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
