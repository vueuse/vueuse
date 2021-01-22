import { defineComponent } from 'vue-demi'
import { useScriptTag } from '.'
import { defineDemo, html } from '../../_docs'

declare const Twitch: any

defineDemo(
  {
    name: 'useScriptTag',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      useScriptTag(
        'https://player.twitch.tv/js/embed/v1.js',
        // This is called on script tag loaded.
        (el: HTMLScriptElement) => {
          new Twitch.Embed('twitch-embed', {
            width: 854,
            height: 480,
            channel: 'Tahul',
          })
        },
      )
    },

    template: html`<div
      id="twitch-embed"
      style="display: flex; justify-content: center; align-items: center;"
    />`,
  }),
)
