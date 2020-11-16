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
      const { toggle } = useFullscreen(el)

      return {
        el,
        toggle,
      }
    },

    template: html`
      <div style="text-align: center;">
        <video ref="el" src="https://vjs.zencdn.net/v/oceans.mp4" width="400" style="margin: 0 auto;" controls></video>
        <br/>
        <button @click="toggle">Go Fullscreen</button>
      </div>
    `,
  }),
)
