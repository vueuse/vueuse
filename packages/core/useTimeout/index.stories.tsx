import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useTimeout } from '.'

defineDemo(
  {
    name: 'useTimeout',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useTimeout(1000)
    },

    template: html`
      <div>
        <p>Ready: {{ready.toString()}}</p>
        <button @click="start()" :disabled="!ready">Start Again</button>
      </div>
    `,
  }),
)
