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
        <strong>locale</strong>: {{ cookies.get('locale') || 'unknown' }}
        <hr>
        <pre>{{ cookies.getAll() }}</pre>
        <button @click="cookies.set('locale', 'ru-RU')">Russian</button>
        <button @click="cookies.set('locale', 'en-US')">English</button>
      </div>
    `,
  }),
)
