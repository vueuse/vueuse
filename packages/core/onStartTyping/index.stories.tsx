import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { onStartTyping } from '.'

const Demo = defineComponent({
  setup() {
    const input = ref(null)
    onStartTyping(() => {
      if (!input.value.active)
        input.value.focus()
    })

    return {
      input,
    }
  },

  render() {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <input ref="input" type="text" placeholder="Start typing to focus" />
          <input type="text" placeholder="Start typing has no effect here" />
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module).add('useOnStartTyping', () => Demo as any)
