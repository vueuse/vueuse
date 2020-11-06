import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useIntervalFn } from '.'

defineDemo(
  {
    name: 'useIntervalFn',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const greetings = ['Hello', 'Hi', 'Yo!', 'Hey', 'Hola', 'こんにちは', 'Bonjour', 'Salut!', '你好']
      const word = ref('Hello')

      const { activated, start, stop } = useIntervalFn(() => {
        word.value = greetings[Math.round(Math.random() * (greetings.length - 1))]
      }, 500)

      return {
        word,
        activated,
        start,
        stop,
      }
    },

    template: html`
      <div>
        <p>{{word}}</p>
        <button @click='stop' class="orange" v-if='activated'>Stop</button>
        <button @click='start' v-if='!activated'>Start</button>
      </div>
    `,
  }),
)
