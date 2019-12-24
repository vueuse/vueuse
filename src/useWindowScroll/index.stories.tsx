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

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

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
    return (
      <div>
        <div style={{ position: 'fixed' }}>x: {x}</div>
        <div style={{ position: 'fixed', top: '2em' }}>y: {y}</div>
        <div style={{ width: '10000px', height: '10000px' }}></div>
      </div>
    )
  },
})

storiesOf('Sensors|useWindowScroll', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo as any)
