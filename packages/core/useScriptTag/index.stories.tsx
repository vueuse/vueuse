import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useScriptTag } from '.'

defineDemo(
  {
    name: 'useScriptTag',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const [twitchScriptTag] = useScriptTag(
        'https://player.twitch.tv/js/embed/v1.js',
      )
    },

    template: html`<div></div>`,
  }),
)
