import { computed, defineComponent, ref } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
import { useFavicon } from '.'

defineDemo(
  {
    name: 'useFavicon',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const type = ref('vueuse')

      const favicon = computed(() =>
        type.value === 'vue'
          ? 'vue.png'
          : 'favicon-32x32.png',
      )

      useFavicon(favicon, {
        baseUrl: 'https://raw.githubusercontent.com/antfu/vueuse/master/resources/favicon/',
        rel: 'icon',
        document: window.parent.document,
      })

      return {
        type,
      }
    },

    template: html`
      <div>
        <note>Change favicon to</note>
        <button @click='type = "vue"'>Vue</button>
        <button @click='type = "vueuse"'>VueUse</button>
      </div>
    `,
  }),
)
