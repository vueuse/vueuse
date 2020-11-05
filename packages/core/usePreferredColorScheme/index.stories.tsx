import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { usePreferredColorScheme } from '.'

defineDemo(
  {
    name: 'usePreferredColorScheme',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        preferredColorScheme: usePreferredColorScheme(),
      }
    },

    template: html`
      <div>
        <p>Preferred Color Scheme: {{preferredColorScheme.toString()}}</p>
      </div>
    `,
  }),
)
