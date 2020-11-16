import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { when } from '.'
import { invoke } from '@vueuse/shared'
import { useCounter } from '../../core/useCounter'

defineDemo(
  {
    name: 'when',
    category: 'Watch',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const el = ref<HTMLElement | null>(null)
      const counter = useCounter()

      invoke(async() => {
        await when(counter.count).toBe(7)

        alert('You got 7!')
      })

      return {
        ...counter,
        el,
      }
    },

    template: html`
      <div ref='el'>
        <note>Add to 7 to show the alert.</note>
        <p>Count: {{count}}</p>
        <button @click="inc()">Increment</button>
        <button @click="dec()">Decrement</button>
      </div>
    `,
  }),
)
