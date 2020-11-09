import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useInterval } from '.'

defineDemo(
  {
    name: 'useInterval',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useInterval(200)
    },

    template: html`
      <div>
      <p>Interval fired: {{counter}}</p>
      </div>
    `,
  }),
)
