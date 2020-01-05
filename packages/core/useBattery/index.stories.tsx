import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useBattery } from '.'

const Demo = createComponent({
  setup () {
    return useBattery()
  },

  render (this: any) {
    const {
      charging,
      chargingTime,
      dischargingTime,
      level,
      supported,
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
            supported,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useBattery', () => Demo as any)
