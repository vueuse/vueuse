import { defineComponent } from 'vue-demi'
import { useStorage } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useStorage',
    category: 'State',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const state = useStorage('vue-use-locale-storage', {
        name: 'Banana',
        color: 'Yellow',
        size: 'Medium',
      })

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
