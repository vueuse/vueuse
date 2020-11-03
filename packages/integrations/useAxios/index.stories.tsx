import { defineComponent } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useAxios } from '.'

defineDemo(
  {
    name: 'useAxios',
    category: '/Integrations',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const { data, finished } = useAxios('https://jsonplaceholder.typicode.com/todos/1')

      return { data, finished }
    },
    template: html`
      <div>
        <note>Ready: {{finished.toString()}}</note>
        <pre lang="json" class="ml-2">{{JSON.stringify(data)}}</pre>
      </div>
    `,
  }),
)
