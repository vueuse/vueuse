import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useRafFn } from '.'

defineDemo(
  {
    name: 'useRafFn',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const count = ref(0)
      const { start, stop } = useRafFn(() => {
        count.value += 1
      })

      return {
        count, start, stop,
      }
    },

    template: html`
      <div>
        <p>Count: {{count}}</p>
      </div>
    `,
  }),
)
