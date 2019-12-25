import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useWindowScroll } from '.'

type Inject = {
  x: number
  y: number
}

const Demo = createComponent({
  setup () {
    const { x, y } = useWindowScroll()

    return {
      x,
      y,
    }
  },

  render (this: Vue & Inject) {
    const { x, y } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo' style={{ position: 'fixed' }}>
          <p>x: {x}</p>
          <p>y: {y}</p>
        </div>
        {Docs}
        <div style={{ width: '10000px', height: '10000px' }}></div>
      </div>
    )
  },
})

storiesOf('Sensors|useWindowScroll', module)
  .add('Demo & Docs', () => Demo as any)
