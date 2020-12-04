import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useMutationObserver } from '.'

defineDemo(
  {
    name: 'useMutationObserver',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const el = ref(null)
      const messages = ref([])
      const className = ref({})
      const style = ref({})

      useMutationObserver(el, (mutations) => {
        const mutation = mutations[0]

        if (!mutation) return

        messages.value.push(mutation.attributeName)
      }, {
        attributes: true,
      })

      setTimeout(() => {
        className.value = {
          test: true,
          test2: true,
        }
      }, 1000)
      setTimeout(() => {
        style.value = {
          backgroundColor: 'red',
        }
      }, 1550)

      return {
        el,
        messages,
        className,
        style,
      }
    },

    template: html`
      <div>
          <div ref="el" :class="className" :style="style">
            <div v-for="(text, index) of messages" :key="index">
              Mutation Attribute: {{text}}
            </div>
          </div>
      </div>
    `,
  }),
)
