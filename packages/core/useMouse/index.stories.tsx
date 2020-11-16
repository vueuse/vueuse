import { defineComponent, reactive } from 'vue-demi'
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
      return {
        mouse: reactive(useMouse()),
      }
    },

    template: html`
      <pre lang="json">{{ JSON.stringify(mouse, null, 2) }}</pre>
    `,
  }),
)
