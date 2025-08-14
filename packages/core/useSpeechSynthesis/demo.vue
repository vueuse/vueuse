<script setup lang="ts">
import { useSpeechSynthesis } from '@vueuse/core'
import { computed, ref as deepRef, onMounted, shallowRef, watch } from 'vue'

const voice = deepRef<SpeechSynthesisVoice>(undefined as unknown as SpeechSynthesisVoice)
const text = shallowRef('Hello, everyone! Good morning!')
const pitch = shallowRef(1)
const rate = shallowRef(1)
const volume = shallowRef(1)

const boundaryStart = shallowRef(0)
const boundaryEnd = shallowRef(0)

const textSegments = computed(() => {
  const fullText = text.value || ''
  const startIndex = Math.max(0, Math.min(boundaryStart.value, fullText.length))
  const endIndex = Math.max(startIndex, Math.min(boundaryEnd.value, fullText.length))
  return {
    leadingText: fullText.slice(0, startIndex),
    highlightedText: fullText.slice(startIndex, endIndex),
    trailingText: fullText.slice(endIndex),
  }
})

const speech = useSpeechSynthesis(text, {
  voice,
  pitch,
  rate,
  volume,
  onBoundary,
})

let synth: SpeechSynthesis

const voices = shallowRef<SpeechSynthesisVoice[]>([])

onMounted(() => {
  if (speech.isSupported.value) {
  // load at last
    setTimeout(() => {
      synth = window.speechSynthesis
      voices.value = synth.getVoices()
      voice.value = voices.value[0]
    })
  }
})

function onBoundary(event: SpeechSynthesisEvent) {
  const { charIndex, charLength } = event
  const startIndex = charIndex
  let endIndex = charIndex
  if (typeof charLength === 'number' && charLength > 0) {
    endIndex = startIndex + charLength
  }
  else {
    const fullText = text.value || ''
    const remainingText = fullText.slice(startIndex)
    const firstWordMatch = remainingText.match(/^\S+/)
    endIndex = startIndex + (firstWordMatch ? firstWordMatch[0].length : 0)
  }
  boundaryStart.value = startIndex
  boundaryEnd.value = endIndex
}

function resetSpeakingText() {
  boundaryStart.value = 0
  boundaryEnd.value = 0
}

function play() {
  if (speech.status.value === 'pause') {
    window.speechSynthesis.resume()
  }
  else {
    resetSpeakingText()
    speech.speak()
  }
}

function pause() {
  window.speechSynthesis.pause()
}

function stop() {
  speech.stop()
  resetSpeakingText()
}

watch(() => speech.status.value, (s) => {
  if (s === 'end') {
    resetSpeakingText()
  }
})
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
      <div class="mt-2" aria-label="current-boundary-preview">
        <label class="font-bold mr-2">Speaking Text</label>
        <span>{{ textSegments.leadingText }}</span>
        <span class="text-primary">{{ textSegments.highlightedText }}</span>
        <span>{{ textSegments.trailingText }}</span>
      </div>

      <br>
      <label class="font-bold mr-2">Language</label>
      <div bg="$vp-c-bg" border="$vp-c-divider 1" inline-flex items-center relative rounded>
        <i i-carbon-language absolute left-2 opacity-80 pointer-events-none />
        <select v-model="voice" px-8 border-0 bg-transparent h-9 rounded appearance-none>
          <option bg="$vp-c-bg" disabled>
            Select Language
          </option>
          <option
            v-for="(voice, i) in voices"
            :key="i"
            bg="$vp-c-bg"
            :value="voice"
          >
            {{ `${voice.name} (${voice.lang})` }}
          </option>
        </select>
        <i i-carbon-chevron-down absolute right-2 opacity-80 pointer-events-none />
      </div>

      <br>
      <div inline-flex items-center>
        <label class="font-bold mr-2">Pitch</label>
        <div class="mt-1" inline-flex>
          <input v-model="pitch" type="range" min="0.5" max="2" step="0.1">
        </div>
      </div>

      <br>
      <div inline-flex items-center>
        <label class="font-bold mr-3">Rate</label>
        <div class="mt-1" inline-flex>
          <input v-model="rate" type="range" min="0.5" max="2" step="0.1">
        </div>
      </div>

      <br>
      <div inline-flex items-center>
        <label class="font-bold mr-3">Volume</label>
        <div class="mt-1" inline-flex>
          <input v-model="volume" type="range" min="0.5" max="2" step="0.1">
        </div>
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
