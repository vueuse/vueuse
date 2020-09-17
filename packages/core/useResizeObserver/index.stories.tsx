import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useResizeObserver } from '.'

const Demo = defineComponent({
  setup() {
    const el = ref(null)
    const text = ref('')

    useResizeObserver(el, (entries) => {
      const entry = entries[0]
      const { width, height } = entry.contentRect
      text.value = `width: ${width}, height: ${height}`
    })

    return {
      el,
      text,
    }
  },

  render(this: Vue & any) {
    const {
      text,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          {/*
          // @ts-ignore */}
          <div ref="el">{text}</div>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('useResizeObserver', () => Demo as any)
