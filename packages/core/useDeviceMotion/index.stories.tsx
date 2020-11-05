import { defineDemo, html } from '../../_docs'
import { defineComponent, reactive } from 'vue-demi'
import { useDeviceMotion } from '.'

defineDemo(
  {
    module,
    category: 'Sensors',
    name: 'useDeviceMotion',
    docs: require('./index.md'),
  },
  defineComponent({
    setup() {
      return {
        motion: reactive(useDeviceMotion()),
      }
    },

    template: html`
      <pre lang="json">{{JSON.stringify(motion, null, 2)}}</pre>
    `,
  }),
)
