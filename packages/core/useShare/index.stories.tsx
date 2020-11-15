import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
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
      const options = ref({
        title: 'Vueuse',
        text: 'Collection of essential Vue Composition API!',
        url: location.href,
      })
      const { share, isSupported } = useShare(options)

      return {
        startShare: () => share().catch(err => err),
        options,
        isSupported,
      }
    },

    template: html`
      <div>
        <input v-if="isSupported" v-model="options.text" type="text" placeholder="Note" />
        <button :disabled="!isSupported" @click="startShare">
          {{ isSupported ? 'Share' : 'Web share not supported!' }}
        </button>
      </div>
    `,
  }),
)
