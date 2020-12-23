<script setup lang="ts">
import { defineComponent, ref, watch } from 'vue-demi'
import { useSpeechRecognition } from '.'

const speech = useSpeechRecognition({
        continuous: true,
      })

      const color = ref('transparent')

      if (speech.isSupported) {
        // @ts-ignore
        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
        const speechRecognitionList: SpeechGrammarList = new SpeechGrammarList()
        speechRecognitionList.addFromString(grammar, 1)
        speech.recognition.grammars = speechRecognitionList

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

      const ...speech,
        sampled,
        color,
        start() {
          color.value = 'transparent'
          speech.result.value = ''
          sampled.value = sample(colors, 5)
          speech.start()
        },
</script>

<template>
  <div>
    <div v-if="!isSupported">
      Your browser doses not support SpeechRecognition API,
      <a href="https://caniuse.com/mdn-api_speechrecognition" target="_blank"
        >more details</a
      >
    </div>
    <div v-else>
      <button @click="start" v-if="!isListening">Press and talk</button>
      <button class="orange" @click="stop" v-if="isListening">Stop</button>
      <div class="mt-4" v-if="isListening">
        <note>
          <b>Please say a color</b>
        </note>
        <note class="-mt-4"> try: {{ sampled.join(', ') }} </note>
        <p class="mx-1 pa-3 rounded" :style="{ background: color }">
          {{ result }}
        </p>
      </div>
    </div>
  </div>
</template>
