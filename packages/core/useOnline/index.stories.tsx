import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useOnline } from '.'

defineDemo(
  {
    name: 'useOnline',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        online: useOnline(),
      }
    },

    template: html`
      <div>
        <p>{{online ? 'Online' : 'Offline'}}</p>
      </div>
    `,
  }),
)
