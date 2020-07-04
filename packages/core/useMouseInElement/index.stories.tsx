import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useMouseInElement } from '.'

const Demo = defineComponent({
  setup() {
    const demoRef = ref(null)
    return {
      ...useMouseInElement(demoRef),
      demo: demoRef,
    }
  },

  render(this: Vue & any) {
    const {
      x,
      y,
      documentX,
      documentY,
      elementX,
      elementY,
      elementPositionX,
      elementPositionY,
      elementHeight,
      elementWidth,
      isOutside,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo' ref='demo' style={{ margin: '20px' }}>
          <pre lang='json'>{JSON.stringify({
            x,
            y,
            documentX,
            documentY,
            elementX,
            elementY,
            elementPositionX,
            elementPositionY,
            elementHeight,
            elementWidth,
            isOutside,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useMouseInElement', () => Demo as any)
