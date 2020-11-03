import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
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
      return useBattery()
    },

    template: html`
      <div>
          <pre lang="json">{{JSON.stringify({
            charging,
            chargingTime,
            dischargingTime,
            level,
            supported,
          }, null, 2)}}
          </pre>
      </div>
    `,
  }),
)
