import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useDevicePixelRatio } from '.'

const Demo = defineComponent({
  setup() {
    const { pixelRatio } = useDevicePixelRatio()

    return { pixelRatio }
  },
  render(this: Vue & any) {
    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <strong>Device Pixel Ratio:</strong> { this.pixelRatio }
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useDevicePixelRatio', () => Demo as any)
