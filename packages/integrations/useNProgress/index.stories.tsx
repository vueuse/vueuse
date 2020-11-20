import { defineComponent } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useNProgress } from '.'
import './style.css'

defineDemo(
  {
    name: 'useNProgress',
    category: '/Integrations',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        loading: useNProgress(),
      }
    },

    template: html`
      <div>
        <note>Click to change progress status</note>
        <button @click='loading = !loading'>{{ !loading ? 'Start' : 'Stop' }}</button>
      </div>
    `,
  }),
)
