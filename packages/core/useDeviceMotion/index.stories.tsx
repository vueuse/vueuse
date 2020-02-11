import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useDeviceMotion } from '.'

const Demo = createComponent({
  setup() {
    return useDeviceMotion()
  },

  render(this: Vue & any) {
    const {
      acceleration,
      accelerationIncludingGravity,
      rotationRate,
      interval,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify({
            acceleration,
            accelerationIncludingGravity,
            rotationRate,
            interval,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useDeviceMotion', () => Demo as any)
