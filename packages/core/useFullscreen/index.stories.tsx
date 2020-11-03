import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useFullscreen } from '.'

defineDemo(
  {
    name: 'useFullscreen',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const el = ref(null)
      const { enterFullscreen } = useFullscreen(el)

      return {
        el,
        enterFullscreen,
      }
    },

    template: html`
      <div style="text-align: center;">
        <video ref="el" src="https://vjs.zencdn.net/v/oceans.mp4" width="400" style="margin: 0 auto;" controls></video>
        <br/>
        <button @click="enterFullscreen">Go Fullscreen</button>
      </div>
    `,
  }),
)
