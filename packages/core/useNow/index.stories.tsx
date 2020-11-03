import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useNow } from '.'

defineDemo(
  {
    name: 'useNow',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        now: useNow(),
      }
    },

    template: html`
      <div>
        <p>Now: {{now}}</p>
      </div>
    `,
  }),
)
