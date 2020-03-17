import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useFullscreen } from '.'

const Demo = defineComponent({
  setup() {
    const el = ref(null)
    const { enterFullscreen, exitFullscreen } = useFullscreen(el)

    return {
      el,
      enterFullscreen,
      exitFullscreen,
    }
  },

  render(this: Vue & any) {
    const {
      enterFullscreen,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo' style={{ textAlign: 'center' }}>
          <video ref="el" src="https://vjs.zencdn.net/v/oceans.mp4" width={400} style={{ margin: '0 auto' }} controls></video>
          <br/>
          <button onClick={enterFullscreen}>Go Fullscreen</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('useFullscreen', () => Demo as any)
