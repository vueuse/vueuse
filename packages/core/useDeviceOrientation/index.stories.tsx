import { defineDemo, html } from '../../_docs'
import { defineComponent, reactive } from 'vue-demi'
import { useDeviceOrientation } from '.'

defineDemo(
  {
    name: 'useDeviceOrientation',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        orientation: reactive(useDeviceOrientation()),
      }
    },

    template: html`
      <div>
        <pre lang="json">{{JSON.stringify(orientation, null, 2)}}
        </pre>
      </div>
    `,
  }),
)
