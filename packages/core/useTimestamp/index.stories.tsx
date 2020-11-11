import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useTimestamp } from '.'

defineDemo(
  {
    name: 'useTimestamp',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        ...useTimestamp(),
      }
    },

    template: html`
      <div>
        <p>Now: {{now}}</p>
      </div>
    `,
  }),
)
