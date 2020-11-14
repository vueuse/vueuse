import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { usePageLeave } from '.'

defineDemo(
  {
    name: 'usePageLeave',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        isLeft: usePageLeave({
          window: window.parent,
        }),
      }
    },

    template: html`
      <div>
        <pre lang="json">{{ { isLeft } }}</pre>
      </div>
    `,
  }),
)
