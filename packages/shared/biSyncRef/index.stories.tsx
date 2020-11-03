import { defineComponent, ref } from 'vue-demi'
import { biSyncRef } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'biSyncRef',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const a = ref('')
      const b = ref('')

      biSyncRef(a, b)

      return {
        a,
        b,
      }
    },
    template: html`
      <div>
        <input v-model='a' placeholder="A"/>
        <input v-model='b' placeholder="B"/>
      </div>
    `,
  }),
)
