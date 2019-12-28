import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useWindowSize } from '.'

type Inject = {
  width: number
  height: number
}

const Demo = createComponent({
  setup () {
    const { width, height } = useWindowSize()

    return {
      width,
      height,
    }
  },

  render (this: Vue & Inject) {
    const { width, height } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>{width} x {height}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useWindowSize', () => Demo as any)
