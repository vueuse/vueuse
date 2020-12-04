import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useBoolean } from '.'

defineDemo(
  {
    name: 'useBoolean',
    category: 'State',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useBoolean()
    },

    template: html`
      <div>
        <p>Value: {{ value ? 'ON' : 'OFF' }}</p>
        <button @click="toggle()">Toggle</button>
        <button @click="set(true)">Set ON</button>
        <button @click="set(false)">Set OFF</button>
      </div>
    `,
  }),
)
