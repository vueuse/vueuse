import { defineDemo, html } from '../../_docs'
import { defineComponent, ref, watch } from 'vue-demi'
import { useThrottle } from '.'

defineDemo(
  {
    name: 'useThrottle',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const input = ref('')
      const throttled = useThrottle(input, 1000)
      const updated = ref(0)

      watch(throttled, () => {
        updated.value += 1
      })

      return {
        input,
        throttled,
        updated,
      }
    },

    template: html`
      <div>
        <input v-model="input" placeholder="Try to type anything..."/>
        <note>Delay is set to 1000ms for this demo.</note>

        <p>Throttled: {{throttled}}</p>
        <p>Times Updated: {{updated}}</p>
      </div>
    `,
  }),
)
