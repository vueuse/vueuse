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
      const { pixelRatio } = useDevicePixelRatio()

      return { pixelRatio }
    },

    template: html`
      <div>
        <strong>Device Pixel Ratio:</strong> {{pixelRatio}}
      </div>
    `,
  }),
)
