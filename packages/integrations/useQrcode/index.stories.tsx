import { defineComponent, ref } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useQRCode } from './index'

defineDemo(
  {
    name: 'useQRCode',
    category: '/Integrations',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const text = ref('vueuse')
      const qrcode = useQRCode(text, { errorCorrectionLevel: 'H' })

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
