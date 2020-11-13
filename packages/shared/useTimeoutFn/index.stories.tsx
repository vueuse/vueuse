import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useTimeoutFn } from '.'

defineDemo(
  {
    name: 'useTimeoutFn',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const defaultText = 'Please wait 3 seconds'
      const text = ref(defaultText)
      const { start } = useTimeoutFn(() => {
        text.value = 'Fired!'
      }, 3000)

      const restart = () => {
        text.value = defaultText
        start()
      }

      return {
        restart,
        text,
      }
    },

    template: html`
      <div>
        <p>{{text}}</p>
        <button @click="restart()">Resetart</button>
      </div>
    `,
  }),
)
