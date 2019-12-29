import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useDeviceLight } from '.'

const Demo = createComponent({
  setup () {
    return useDeviceLight()
  },

  render (this: Vue & any) {
    const {
      light,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify({
            light,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useDeviceLight', () => Demo as any)
