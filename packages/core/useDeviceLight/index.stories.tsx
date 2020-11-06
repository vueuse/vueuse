import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useDeviceLight } from '.'

defineDemo(
  {
    name: 'useDeviceLight',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        light: useDeviceLight({
          window: window.parent,
        }),
      }
    },

    template: html`
      <div>
        <pre lang="json">{{JSON.stringify({ light }, null, 2)}}</pre>
      </div>
    `,
  }),
)
