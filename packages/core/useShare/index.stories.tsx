import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useShare } from '.'

defineDemo(
  {
    name: 'useShare',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        share: () => useShare({ title: 'Hello', text: 'Hello my friend!', url: location.href }),
      }
    },

    template: html`
      <div>
        <button @click="share">Share</button>
      </div>
    `,
  }),
)
