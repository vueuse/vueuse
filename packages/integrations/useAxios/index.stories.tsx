import { defineComponent } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useCounter } from '../../core/useCounter'

defineDemo(
  {
    name: 'useAxios',
    category: 'Add-ons|Intergrations',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useCounter()
    },

    template: html`
      <div>
        <p>Count: {{count}}</p>
        <button @click="inc()">Increment</button>
        <button @click="dec()">Decrement</button>
        <button @click="inc(5)">Increment (+5)</button>
        <button @click="dec(5)">Decrement (-5)</button>
        <button @click="set(100)">Set (100)</button>
        <button @click="reset()">Reset</button>
      </div>
    `,
  }),
)
