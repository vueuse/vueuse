import { defineDemo, html } from '../../_docs'
import { defineComponent, ref, watch } from 'vue-demi'
import { useSpeechRecognition } from '.'

const colors = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow', 'transparent']
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(' | ')} ;`

defineDemo(
  {
    name: 'useSpeechRecognition',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const speech = useSpeechRecognition({
        continuous: true,
      })

      const color = ref('transparent')

      if (speech.isSupported && speech.recognition) {
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

      return { ...speech, color }
    },

    template: html`
      <div>
        <div v-if='!isSupported'>
          Your browser doses not support SpeechRecognition API, <a href='https://caniuse.com/mdn-api_speechrecognition' target='_blank'>more details</a>
        </div>
        <div v-else>
          <button @click='start' v-if='!isListening'>Press and talk</button>
          <button class='orange' @click='stop' v-if='isListening'>Stop</button>
          <div class="mt-4 mx-1 pa-3" :style="{background: color}" v-if='isListening'>
            <note>
              Please name a color
            </note>
            <p class="-mt-2 rounded shadow">{{result}}</p>
          </div>
        </div>
      </div>
    `,
  }),
)
