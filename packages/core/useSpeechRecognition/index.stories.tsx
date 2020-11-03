import { defineDemo, html } from '../../_docs'
import { defineComponent, ref, watch } from 'vue-demi'
import { useSpeechRecognition } from '.'

function sample(arr: string[], size: number) {
  const shuffled = arr.slice(0); let i = arr.length; let temp; let index
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

      return {
        ...speech,
        sampled,
        color,
        start() {
          color.value = 'transparent'
          speech.result.value = ''
          sampled.value = sample(colors, 5)
          speech.start()
        },
      }
    },

    template: html`
      <div>
        <div v-if='!isSupported'>
          Your browser doses not support SpeechRecognition API, <a href='https://caniuse.com/mdn-api_speechrecognition' target='_blank'>more details</a>
        </div>
        <div v-else>
          <button @click='start' v-if='!isListening'>Press and talk</button>
          <button class='orange' @click='stop' v-if='isListening'>Stop</button>
          <div class="mt-4" v-if='isListening'>
            <note>
              <b>Please say a color</b>
            </note>
            <note class="-mt-4">
              try: {{sampled.join(', ')}}
            </note>
            <p class="mx-1 pa-3 rounded" :style="{background: color}">{{result}}</p>
          </div>
        </div>
      </div>
    `,
  }),
)
