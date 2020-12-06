import { defineDemo, html } from '../../_docs'
import { defineComponent, reactive, ref } from 'vue-demi'
import { useElementBounding } from '.'

defineDemo(
  {
    name: 'useElementBounding',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const el = ref(null)
      const rect = reactive(useElementBounding(el))

      return {
        el,
        rect,
      }
    },

    template: html`
      <div style="min-height: 400px">
        <pre
          ref="el"
          class="resize bg-gray-600 bg-opacity-25 select-none p-4 overflow-auto"
          style="width: 300px; height: 300px;"
          >{{rect}}
        </pre>
      </div>
    `,
  }),
)
