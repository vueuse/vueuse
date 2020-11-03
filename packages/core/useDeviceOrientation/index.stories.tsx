import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
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
      const {
        isAbsolute,
        alpha,
        beta,
        gamma,
      } = useDeviceOrientation()

      return {
        isAbsolute,
        alpha,
        beta,
        gamma,
      }
    },

    template: html`
      <div>
        <pre lang="json">{{JSON.stringify({
            isAbsolute,
            alpha,
            beta,
            gamma,
          }, null, 2)}}
        </pre>
      </div>
    `,
  }),
)
