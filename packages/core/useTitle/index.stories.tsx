import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useTitle } from '.'

defineDemo(
  {
    name: 'useTitle',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        title: useTitle(
          null,
          window.parent.document,
        ),
      }
    },

    template: html`
      <div>
        <note>Title</note>
        <input v-model="title"/>
      </div>
    `,
  }),
)
