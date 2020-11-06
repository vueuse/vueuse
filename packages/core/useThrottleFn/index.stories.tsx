import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useThrottleFn } from '.'

defineDemo(
  {
    name: 'useThrottleFn',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const updated = ref(0)
      const clicked = ref(0)
      const throttledFn = useThrottleFn(() => {
        updated.value += 1
      }, 1000)

      const clickedFn = () => {
        clicked.value += 1
        throttledFn()
      }

      return {
        clicked,
        clickedFn,
        throttledFn,
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
