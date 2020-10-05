import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
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
      return useDeviceMotion()
    },

    template: html`
      <pre lang="json">{{
        JSON.stringify({
          acceleration,
          accelerationIncludingGravity,
          rotationRate,
          interval,
        }, null, 2)
      }}</pre>
    `,
  }),
)
