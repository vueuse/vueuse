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
      params.value.set('foo', 'bar')
      return {
        params,
      }
    },

    template: html`
      <div>
        <ul>
          <li v-for="[key, value] in params">{{ key }}={{ value }}</li>
        </ul>
      </div>
    `,
  }),
)
