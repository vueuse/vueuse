import { defineComponent } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useCookies } from './index'

defineDemo(
  {
    name: 'useCookies',
    category: '/Integrations',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const cookies = useCookies(['locale'])

      return {
        cookies,
      }
    },

    template: html`
      <div>
        <p>
          <strong>Cookies Value</strong>: {{ cookies.get('locale') || 'unknown' }}
        </p>
        <pre class="ml-2">{{ JSON.stringify(cookies.getAll(), null, 2) }}</pre>
        <br>
        <note>Change to</note>
        <button @click="cookies.set('locale', 'ru-RU')">Russian</button>
        <button @click="cookies.set('locale', 'en-US')">English</button>
      </div>
    `,
  }),
)
