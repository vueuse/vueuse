import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useBrowserLocation } from '.'

defineDemo(
  {
    name: 'useBrowserLocation',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        location: useBrowserLocation(),
      }
    },
    template: html`
      <pre lang="json">{{JSON.stringify({ location }, null, 2)}}</pre>
    `,
  }),
)
