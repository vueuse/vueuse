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
      const text = ref('https://vueuse.js.org')
      const qrcode = useQRCode(text, {
        errorCorrectionLevel: 'H',
        margin: 3,
      })

      return {
        qrcode,
        text,
      }
    },

    template: html`
      <div>
        <input v-model="text" />
        <img
          class="ml-1 mt-6 mb-2 rounded"
          :src="qrcode"
          alt="QR Code"
        >
      </div>
    `,
  }),
)
