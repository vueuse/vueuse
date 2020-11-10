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
      const { share, isSupported } = useShare()

      return {
        startShare: () => share({
          title: 'Hello',
          text: 'Hello my friend!',
          url: location.href,
        }),
        isSupported,
      }
    },

    template: html`
      <div>
        <button :disabled="!isSupported" @click="startShare">
          {{ isSupported ? 'Share' : 'Web share not supported!' }}
        </button>
      </div>
    `,
  }),
)
