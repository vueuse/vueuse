import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useBattery, BatteryManager } from '.'

const Demo = createComponent({
  setup () {
    return useBattery()
  },

  render (this: Vue & BatteryManager) {
    const {
      charging,
      chargingTime,
      dischargingTime,
      level,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify({
            charging,
            chargingTime,
            dischargingTime,
            level,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors|useBattery', module)
  .add('Demo & Docs', () => Demo as any)
