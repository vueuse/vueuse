import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useElementVisibility } from '.'

type Inject = {
  demoIsVisible: boolean
}

const Demo = defineComponent({
  setup() {
    const demo = ref(null)
    const demoIsVisible = useElementVisibility(demo)

    return {
      demo,
      demoIsVisible,
    }
  },
  render(this: Vue & Inject) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')}/>

    return (
      <div>
        <div
          style={{ border: '2px dashed #ccc', margin: '10rem 2rem', padding: '1rem' }}
          ref="demo">
          <h1>Hello world</h1>
        </div>
        {Docs}
        <div id='demo' style={{ position: 'fixed', bottom: 0, right: 0, padding: '1em 5em 1em 1.5em' }}>
          {this.demoIsVisible ? 'In the viewport' : 'Outside the viewport'}
        </div>
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useElementVisibility', () => Demo as any)
