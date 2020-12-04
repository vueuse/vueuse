import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useElementSize } from '.'

defineDemo(
  {
    name: 'useElementSize',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const el = ref(null)
      const { width, height } = useElementSize(el)

      return {
        el,
        width,
        height,
      }
    },

    template: html`
      <div>
        <textarea
          ref="el"
          style="
            resize: both;
            background: transparent;
            padding: 10px;
            border: 1px solid #ffffff33;
            width: 300px
          "
          disabled>width: {{width}}, height: {{height}}
        </textarea>
      </div>
    `,
  }),
)
