import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useIntervalFn } from '.'

defineDemo(
  {
    name: 'useIntervalFn',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const count = ref(0)

      useIntervalFn(() => {
        count.value++
      }, 1000)

      return {
        count,
      }
    },

    template: html`
      <div>
        <p>Seconds passed: {{count}}</p>
      </div>
    `,
  }),
)
