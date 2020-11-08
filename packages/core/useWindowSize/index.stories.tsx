import { defineComponent } from 'vue-demi'
import { useWindowSize } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useWindowSize',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useWindowSize()
    },

    template: html`
      <div>
        <p>{{width}} x {{height}}</p>
      </div>
    `,
  }),
)
