import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref, onMounted } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useMutationObserver } from '.'

const Demo = defineComponent({
  setup() {
    const el = ref(null)
    const messages = ref([])
    const className = ref({})
    const style = ref({})

    useMutationObserver(el, (mutations) => {
      const mutation = mutations[0]
      if (!mutation) return

      messages.value.push(mutation.attributeName)
    }, {
      attributes: true,
    })

    onMounted(() => {
      setTimeout(() => {
        className.value = {
          test: true,
          test2: true,
        }
      }, 1000)
      setTimeout(() => {
        style.value = {
          backgroundColor: 'red',
        }
      }, 1500)
    })

    return {
      el,
      messages,
      className,
      style,
    }
  },

  render(this: Vue & any) {
    const {
      messages,
      className,
      style,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          {/*
          // @ts-ignore */}
          <div ref="el" class={className} style={style}>
            {
              messages.map((text, index) => (
                <div key={index}>Mutation Attribute: {text}</div>
              ))
            }
          </div>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('useMutationObserver', () => Demo as any)
