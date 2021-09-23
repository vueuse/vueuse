<script setup lang="ts">
import { ref, watch } from 'vue-demi'
import { useSpeechRecognition } from '.'

const lang = ref('en-US')

function sample<T>(arr: T[], size: number) {
  const shuffled = arr.slice(0)
  let i = arr.length
  let temp: T
  let index: number
  while (i--) {
    index = Math.floor((i + 1) * Math.random())
    temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled.slice(0, size)
}

const colors = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow', 'transparent']
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(' | ')} ;`

const speech = useSpeechRecognition({
  lang,
  continuous: true,
})

const color = ref('transparent')

if (speech.isSupported) {
  // @ts-ignore
  const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
  const speechRecognitionList = new SpeechGrammarList()
  speechRecognitionList.addFromString(grammar, 1)
  speech.recognition!.grammars = speechRecognitionList

  watch(speech.result, () => {
    for (const i of speech.result.value.toLowerCase().split(' ').reverse()) {
      if (colors.includes(i)) {
        color.value = i
        break
      }
    }
  })
}

const sampled = ref<string[]>([])

const start = () => {
  color.value = 'transparent'
  speech.result.value = ''
  sampled.value = sample(colors, 5)
  speech.start()
}

const { isListening, isSupported, stop, result } = speech

const selectedLanguage = ref(lang.value)
watch(lang, lang => isListening.value ? null : selectedLanguage.value = lang)
watch(isListening, isListening => isListening ? null : selectedLanguage.value = lang.value)
</script>

<template>
  <div>
    <div v-if="!isSupported">
      Your browser does not support SpeechRecognition API,
      <a
        href="https://caniuse.com/mdn-api_speechrecognition"
        target="_blank"
      >more details</a>
    </div>
    <div v-else>
      <div>
        <input id="en-US" v-model="lang" type="radio" value="en-US" />
        <label for="en-US">English (US)</label>
        <input id="fr" v-model="lang" type="radio" value="fr" />
        <label for="fr">French</label>
        <input id="es" v-model="lang" type="radio" value="es" />
        <label for="es">Spanish</label>
      </div>
      <button v-if="!isListening" @click="start">
        Press and talk
      </button>
      <button v-if="isListening" class="orange" @click="stop">
        Stop
      </button>
      <div v-if="isListening" class="mt-4">
        <template v-if="selectedLanguage === 'en-US'">
          <note class="mb-2">
            <b>Please say a color</b>
          </note>
          <note class="mb-2">
            try: {{ sampled.join(', ') }}
          </note>
        </template>

        <p v-else-if="selectedLanguage === 'es'">
          Speak some Spanish!
        </p>

        <p v-else-if="selectedLanguage === 'fr'">
          Speak some French!
        </p>

        <p
          class="tag"
          :style="selectedLanguage === 'en-US' ? { background: color } : {}"
        >
          {{ result }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag {
  padding: 0.3rem 0.6rem;
  margin-right: 0.5rem;
  border-radius: 4px;
}
</style>
