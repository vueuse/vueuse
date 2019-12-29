import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useParallax } from '.'

const Demo = createComponent({
  setup () {
    const demoRef = ref(null)

    return {
      ...useParallax({ refEl: demoRef }),
      demo: demoRef,
    }
  },

  render (this: Vue & any) {
    const {
      roll,
      tilt,
      source,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo' ref='demo'>
          <pre lang='json'>{JSON.stringify({
            roll,
            tilt,
            source,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useParallax', () => Demo as any)
