import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useDevicePixelRatio } from '.'

defineDemo(
  {
    name: 'useDevicePixelRatio',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        pixelRatio: useDevicePixelRatio(),
      }
    },

    template: html`
      <div>
        <strong>Device Pixel Ratio:</strong> <code>{{pixelRatio}}</code>
      </div>
    `,
  }),
)
