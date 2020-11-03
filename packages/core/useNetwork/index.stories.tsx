import { defineComponent, reactive } from 'vue-demi'
import { useNetwork } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useNetwork',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        network: reactive(useNetwork()),
      }
    },
    template: html`
      <pre lang="json">{{JSON.stringify(network, null, 2)}}</pre>
    `,
  }),
)
