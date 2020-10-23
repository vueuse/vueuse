import { defineComponent } from 'vue-demi'
import { useMouse } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useMouse',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useMouse()
    },

    template: html`
      <pre lang="json">{{ JSON.stringify({ x, y }, null, 2) }}</pre>
    `,
  }),
)
