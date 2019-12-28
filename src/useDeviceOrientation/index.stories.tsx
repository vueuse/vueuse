import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useDeviceOrientation } from '.'

const Demo = createComponent({
  setup () {
    return useDeviceOrientation()
  },

  render (this: Vue & any) {
    const {
      isAbsolute,
      alpha,
      beta,
      gamma,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify({
            isAbsolute,
            alpha,
            beta,
            gamma,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useDeviceOrientation', () => Demo as any)
