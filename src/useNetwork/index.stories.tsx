import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useNetwork, NetworkState } from '.'

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

const Demo = createComponent({
  setup () {
    const network = useNetwork()

    return {
      ...network,
    }
  },

  render (this: Vue & NetworkState) {
    const { online, since, downlink, downlinkMax, effectiveType, rtt, type } = this
    return (
      <div>
        <pre lang='json'>{JSON.stringify({ online, since, downlink, downlinkMax, effectiveType, rtt, type }, null, 2)}</pre>
      </div>
    )
  },
})

storiesOf('Sensors|useNetwork', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo)
