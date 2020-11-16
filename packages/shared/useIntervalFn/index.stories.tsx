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

      return {
        word,
        ...useIntervalFn(() => {
          word.value = greetings[Math.round(Math.random() * (greetings.length - 1))]
        }, 500),
      }
    },

    template: html`
      <div>
        <p>{{word}}</p>
        <button @click='pause' class="orange" v-if='isActive'>Pause</button>
        <button @click='resume' v-if='!isActive'>Resume</button>
      </div>
    `,
  }),
)
