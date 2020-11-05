import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { usePreferredDark } from '.'

defineDemo(
  {
    name: 'usePreferredDark',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        prefersDark: usePreferredDark(),
      }
    },

    template: html`
      <div>
        <p>Prefers Dark: {{prefersDark.toString()}}</p>
      </div>
    `,
  }),
)
