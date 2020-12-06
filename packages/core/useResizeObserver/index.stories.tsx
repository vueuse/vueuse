import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useResizeObserver } from '.'

defineDemo(
  {
    name: 'useResizeObserver',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const el = ref(null)
      const text = ref('')

      useResizeObserver(el, (entries) => {
        const [entry] = entries
        const { width, height } = entry.contentRect
        text.value = `width: ${width}, height: ${height}`
      })

      return {
        el,
        text,
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
          disabled>{{text}}
        </textarea>
      </div>
    `,
  }),
)
