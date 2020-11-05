import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useRaf } from '.'

defineDemo(
  {
    name: 'useRaf',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        elapsed: useRaf(),
      }
    },

    template: html`
      <div>
        <p>Elapsed: {{elapsed}}</p>
      </div>
    `,
  }),
)
