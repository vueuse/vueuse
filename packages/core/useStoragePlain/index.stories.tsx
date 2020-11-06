import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useStoragePlain } from '.'

defineDemo(
  {
    name: 'useStoragePlain',
    category: 'State',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        store: useStoragePlain('vue-use-locale-storage-plain', 'Hello World!'),
      }
    },

    template: html`
      <div>
          <note>The following message will persist</note>
          <input v-model="store" type="text"/>
      </div>
    `,
  }),
)
