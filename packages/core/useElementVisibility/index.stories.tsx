import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref, watch } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useElementVisibility } from '.'

type Inject = {
  idle: boolean
  lastActive: number
  idledFor: number
}

const Demo = createComponent({
  setup() {
    const demo = ref(null)
    const demoIsVisible = useElementVisibility(demo)

    watch(demoIsVisible, () => {
      console.log(demoIsVisible.value ? 'Entered the viewport' : 'Left the viewport')
    })

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
      </div>
    )
  },
})

storiesOf('State', module)
  .add('useElementVisibility', () => Demo as any)
