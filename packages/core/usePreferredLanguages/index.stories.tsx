import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { usePreferredLanguages } from '.'

defineDemo(
  {
    name: 'usePreferredLanguages',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        usePreferredLanguages: usePreferredLanguages(),
      }
    },

    template: html`
      <div>
        <p>Preferred Languages: <code>{{usePreferredLanguages.join(', ')}}</code></p>
      </div>
    `,
  }),
)
