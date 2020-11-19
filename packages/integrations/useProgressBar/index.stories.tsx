import { defineComponent } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useProgressBar } from '.'
import './style.css'

defineDemo(
  {
    name: 'useProgressBar',
    category: '/Integrations',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        loading: useProgressBar(),
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
