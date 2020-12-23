import { defineComponent } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useUrlSearchParams } from '.'

defineDemo(
  {
    name: 'useUrlSearchParams',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const params = useUrlSearchParams('history', { window: window.parent })
      params.foo = 'bar'
      return {
        params,
      }
    },

    template: html`
      <div>
        <ul>
          <li v-for="key in Object.keys(params)">{{ key }}={{ params[key] }}</li>
        </ul>
      </div>
    `,
  }),
)
