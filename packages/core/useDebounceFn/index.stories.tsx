import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useDebounceFn } from '.'

defineDemo(
  {
    name: 'useDebounceFn',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const updated = ref(0)
      const clicked = ref(0)
      const debouncedFn = useDebounceFn(() => {
        updated.value += 1
      }, 1000)

      const clickedFn = () => {
        clicked.value += 1
        debouncedFn()
      }

      return {
        clicked,
        clickedFn,
        updated,
      }
    },

    template: html`
      <div>
          <button @click="clickedFn">Smash me!</button>
          <note>Delay is set to 1000ms for this demo.</note>

          <p>Button clicked: {{clicked}}</p>
          <p>Event handler called: {{updated}}</p>
      </div>
    `,
  }),
)
