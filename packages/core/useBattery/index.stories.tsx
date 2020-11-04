import { defineDemo, html } from '../../_docs'
import { defineComponent, reactive } from 'vue-demi'
import { useBattery } from '.'

defineDemo(
  {
    name: 'useBattery',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        battery: reactive(useBattery()),
      }
    },

    template: html`
      <div>
          <pre lang="json">{{JSON.stringify(battery, null, 2)}}
          </pre>
      </div>
    `,
  }),
)
