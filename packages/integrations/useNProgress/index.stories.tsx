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
      return useNProgress()
    },

    template: html`
      <div>
        <note>Click to change progress status</note>
        <div class="flex items-center">
          <button @click='isLoading = !isLoading'>{{ !isLoading ? 'Start' : 'Stop' }}</button>
        </div>
      </div>
    `,
  }),
)
