import { defineDemo, html } from '../../_docs'
import { defineComponent, ref, watch } from 'vue-demi'
import { useDebounce } from '.'

defineDemo(
  {
    name: 'useDebounce',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const input = ref('')
      const debounced = useDebounce(input, 1000)
      const updated = ref(0)

      watch(debounced, () => updated.value += 1)

      return {
        input,
        debounced,
        updated,
      }
    },

    template: html`
      <div>
          <input v-model="input"" placeholder="Try to type anything..."/>
          <note>Delay is set to 1000ms for this demo.</note>

          <p>Debounced: {{debounced}}</p>
          <p>Times Updated: {{updated}}</p>
      </div>
    `,
  }),
)
