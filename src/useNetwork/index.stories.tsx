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
    const {
      isOnline,
      offlineAt,
      downlink,
      downlinkMax,
      effectiveType,
      saveData,
      type,
    } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify({
            isOnline,
            offlineAt,
            downlink,
            downlinkMax,
            effectiveType,
            saveData,
            type,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useNetwork', () => Demo as any)
