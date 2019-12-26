import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'
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
        <div id='demo' style={{ position: 'fixed', bottom: 0, right: 0, padding: '1em 5em 1em 1.5em' }}>
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
