import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useShare } from '.'

defineDemo(
  {
    name: 'useShare',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useShare({
        title: 'Hello',
        text: 'Hello my friend!',
        url: location.href,
      })
    },

    template: html`
      <div>
        <button :disabled="!isSupported" @click="share">
          {{ isSupported ? 'Share' : 'Web share not supported!' }}
        </button>
      </div>
    `,
  }),
)
