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
      return useNProgress(0.1)
    },

    template: html`
      <div>
        <note>Click to change progress status</note>
        <button @click='isLoading = !isLoading'>{{ !isLoading ? 'Start' : 'Stop' }}</button>
        <button v-if="isLoading" @click='remove'>Remove</button>
      </div>
    `,
  }),
)
