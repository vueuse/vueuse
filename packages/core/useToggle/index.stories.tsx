import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useToggle } from '.'

defineDemo(
  {
    name: 'useToggle',
    category: 'State',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const [value, toggle] = useToggle()
      return {
        value,
        toggle,
      }
    },

    template: html`
      <div>
        <p>Value: {{ value ? 'ON' : 'OFF' }}</p>
        <button @click="toggle()">Toggle</button>
        <button @click="value = true">Set ON</button>
        <button @click="value = false">Set OFF</button>
      </div>
    `,
  }),
)
