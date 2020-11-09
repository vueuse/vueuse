import { useTimeoutFn } from '@vueuse/shared'
import { defineDemo, html } from '../../_docs'
import { defineComponent, ref, watch } from 'vue-demi'
import { useDocumentVisibility } from '.'

defineDemo(
  {
    name: 'useDocumentVisibility',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const startMessage = 'Minimize this page or change the tab and return'
      const message = ref(startMessage)
      const visibility = useDocumentVisibility()

      const timeout = useTimeoutFn(() => {
        message.value = startMessage
      }, 3000)

      watch(visibility, (current, previous) => {
        if (current === 'visible' && previous === 'hidden') {
          message.value = 'Welcome back!'
          timeout.start()
        }
      })

      return { message }
    },

    template: html`
      <div>
        <h1>{{message}}</h1>
      </div>
    `,
  }),
)
