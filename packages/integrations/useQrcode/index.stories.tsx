import { defineComponent, ref } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useQrcode } from './index'

defineDemo(
  {
    name: 'useQrcode',
    category: 'Add-ons|Integrations',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const text = ref('vueuse')
      const qrcode = useQrcode(text)

      return {
        qrcode,
        text,
      }
    },

    template: html`
      <div>
        <input v-model="text" />
        <img
          :src="qrcode"
          alt="QR Code"
        >
      </div>
    `,
  }),
)
