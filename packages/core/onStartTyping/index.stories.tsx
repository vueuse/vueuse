import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { onStartTyping } from '.'

defineDemo(
  {
    name: 'onStartTyping',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const input = ref(null)
      onStartTyping(() => {
        if (!input.value.active)
          input.value.focus()
      })

      return {
        input,
      }
    },
    template: html`
      <div>
        <input ref="input" type="text" placeholder="Start typing to focus" />
        <input type="text" placeholder="Start typing has no effect here" />
      </div>
    `,
  }),
)
