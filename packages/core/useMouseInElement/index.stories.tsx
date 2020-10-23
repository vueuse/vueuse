import { defineComponent, ref } from 'vue-demi'
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
        ...useMouseInElement(demoRef),
        demo: demoRef,
      }
    },

    template: html`
      <pre lang="json" ref='demo'>{{ JSON.stringify({
        x,
        y,
        documentX,
        documentY,
        elementX,
        elementY,
        elementPositionX,
        elementPositionY,
        elementHeight,
        elementWidth,
        isOutside,
      }, null, 2) }}</pre>
    `,
  }),
)
