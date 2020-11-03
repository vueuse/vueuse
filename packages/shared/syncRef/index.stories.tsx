import { defineComponent, ref } from 'vue-demi'
import { syncRef } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'syncRef',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const source = ref('')
      const target1 = ref('')
      const target2 = ref('')

      syncRef(source, [target1, target2])

      return {
        source,
        target1,
        target2,
      }
    },
    template: html`
      <div>
        <input v-model='source' placeholder="Source"/>
        <input v-model='target1' placeholder="Target1"/>
        <input v-model='target2' placeholder="Target2"/>
      </div>
    `,
  }),
)
