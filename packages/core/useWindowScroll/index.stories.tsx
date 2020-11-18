import { defineComponent } from 'vue-demi'
import { useWindowScroll } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useWindowScroll',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useWindowScroll()
    },

    template: html`
      <div>
        <note>See scroll values in the lower right corner of the screen.</note>
        <div style="
          position: absolute; 
          top: 100%;
          left: 100%;
          width: 10000px; 
          height: 10000px;
        "></div>
        <div id="demo" style="
          position: fixed;
          bottom: 0;
          right: 0;
          padding: 1em 5em 1em 1.5em;
          min-width: 320px;
        ">
          <p>x: {{x}}</p>
          <p>y: {{y}}</p>
        </div>
      </div>
    `,
  }),
)
