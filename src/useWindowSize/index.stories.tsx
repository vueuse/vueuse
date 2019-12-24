import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useWindowSize } from '.'

type Inject = {
  width: number
  height: number
}

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

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
    return (
      <div>
        <div>{width} x {height}</div>
      </div>
    )
  },
})

storiesOf('Sensors|useWindowSize', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo as any)
