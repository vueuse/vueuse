import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { createGlobalState } from '.'
import { useStorage } from '../useStorage'

const useState = createGlobalState(() => {
  return useStorage('vue-use-locale-storage', {
    name: 'Banana',
    color: 'Yellow',
    size: 'Medium',
  })
})

defineDemo(
  {
    name: 'createGlobalState',
    category: 'State',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const state = useState()

      return {
        state,
      }
    },

    template: html`
      <div>
        <input v-model="state.name" type="text"/>
        <input v-model="state.color" type="text"/>
        <input v-model="state.size" type="text"/>

        <pre lang="json">{{JSON.stringify(state, null, 2)}}</pre>
      </div>
    `,
  }),
)
