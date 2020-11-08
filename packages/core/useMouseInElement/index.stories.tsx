import { defineComponent, reactive, ref } from 'vue-demi'
import { useMouseInElement } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useMouseInElement',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const demoRef = ref(null)
      return {
        demo: demoRef,
        mouse: reactive(useMouseInElement(demoRef)),
      }
    },

    template: html`
      <pre lang="json" ref='demo'>{{ JSON.stringify(mouse, null, 2) }}</pre>
    `,
  }),
)
