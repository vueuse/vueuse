import { defineComponent } from 'vue-demi';
import { defineDemo, html } from '../../_docs';
import {useUrlSearchParams} from "."

defineDemo(
  {
    name: 'useUrlSearchParams',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const params = useUrlSearchParams('history')
      params.value.set("foo", "bar")
      return {
        params
      }
    },

    template: html`
        <div>
          <note>This demo has it's own window object, so you can't see changes in your URL bar</note>
          <ul>
            <li v-for="[key, value] in params">{{ key }}={{ value }}</li>
          </ul>
        </div>
    `,
  })
)
