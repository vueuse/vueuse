import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useNetwork, NetworkState } from '.'

const Demo = createComponent({
  setup () {
    const network = useNetwork()

    return {
      ...network,
    }
  },

  render (this: Vue & NetworkState) {
    const { online, since, downlink, downlinkMax, effectiveType, rtt, type } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify({ online, since, downlink, downlinkMax, effectiveType, rtt, type }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors|useNetwork', module)
  .add('Demo & Docs', () => Demo as any)
