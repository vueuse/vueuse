import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { when } from '.'
import { invoke } from '../utils'
import { useCounter } from '../useCounter'

defineDemo(
  {
    name: 'when',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  // Vue component for the demo section
  defineComponent({
    setup() {
      const el = ref<HTMLElement>(null)
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
