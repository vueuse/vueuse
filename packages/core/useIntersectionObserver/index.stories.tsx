import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useIntersectionObserver } from '.'

type Inject = {
  demoIsVisible: boolean
}

const Demo = defineComponent({
  setup() {
    const root = ref(null)
    const demo = ref(null)
    const demoIsVisible = ref(false)

    useIntersectionObserver({
      // root,
      target: demo,
      onIntersect: ([{ isIntersecting }], observerElement) => {
        // console.log(observerElement);
        demoIsVisible.value = isIntersecting
      },
    })

    return {
      root,
      demo,
      demoIsVisible,
    }
  },
  render(this: Vue & Inject) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div
          style={{
            border: '2px dashed #ccc',
            maxHeight: '100px',
            margin: '6rem 2rem',
            overflowY: 'scroll',
          }}
          ref="root"
        >
          <p style={{ textAlign: 'center' }}>Scroll!</p>
          <div
            style={{
              border: '2px dashed #d78a8a',
              minHeight: '200px',
              margin: '10rem 2rem',
              padding: '1rem',
            }}
            ref="demo"
          >
            <h1>Hello world</h1>
          </div>
        </div>
        {Docs}
        <div
          id="demo"
          style={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            padding: '1em 5em 1em 1.5em',
          }}
        >
          {this.demoIsVisible ? 'In the viewport' : 'Outside the viewport'}
        </div>
      </div>
    )
  },
})

storiesOf('Sensors', module).add('useIntersectionObserver', () => Demo as any)
