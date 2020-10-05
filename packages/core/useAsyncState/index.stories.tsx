import axios from 'axios'
import YAML from 'js-yaml'
import { defineComponent } from 'vue-demi'
import { useAsyncState } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useAsyncState',
    category: 'State',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const { state, ready } = useAsyncState(
        axios
          .get('https://jsonplaceholder.typicode.com/todos/1')
          .then(t => t.data),
        {},
        2000,
      )

      return { state, ready, YAML }
    },
    template: html`
      <div>
        <note>Ready: {{ready.toString()}}</note>
        <pre lang="json" class="ml-2">{{YAML.safeDump(state)}}</pre>
      </div>
    `,
  }),
)
