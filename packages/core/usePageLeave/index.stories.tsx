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
        isLeft: usePageLeave(),
      }
    },

    template: html`
      <div>
        <pre lang="json">{{
          JSON.stringify({
            isLeft,
          }, null, 2)
        }}</pre>
      </div>
    `,
  }),
)
