import { defineDemo, html } from '../../_docs'
import { defineComponent, reactive } from 'vue-demi'
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
      const shareOptions = reactive({
        title: 'Vueuse',
        text: 'Collection of essential Vue Composition API!',
        url: location.href,
      })
      const { share, isSupported } = useShare(shareOptions)

      return {
        startShare: () => share().catch(err => null),
        shareOptions,
        isSupported,
      }
    },

    template: html`
      <div>
        <input v-if="isSupported" v-model="shareOptions.text" type="text" placeholder="Note" />
        <button :disabled="!isSupported" @click="startShare">
          {{ isSupported ? 'Share' : 'Web share not supported!' }}
        </button>
      </div>
    `,
  }),
)
