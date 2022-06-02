import { defineComponent, h, nextTick, onMounted, ref } from 'vue-demi'
import { mount } from '../../.test'
import { templateRef } from '../templateRef'
import { unrefElement } from '.'

describe('unrefElement', () => {
  it('should be defined', () => {
    expect(unrefElement).toBeDefined()
  })

  it('works with regular html elements', () => {
    const refKey = 'target'

    mount(defineComponent({
      setup() {
        const targetEl = templateRef(refKey)

        expect(unrefElement(targetEl)).toBeNull()

        onMounted(() => {
          expect(unrefElement(targetEl)).toBeInstanceOf(HTMLElement)
        })

        return { targetEl }
      },
      render() {
        return h('div', { ref: refKey })
      },
    }))
  })

  it('works with Vue components which expose a proxy $el', () => {
    const helperComponent = defineComponent({
      props: {
        text: String,
      },
      setup(props, { expose }) {
        const buttonRef = ref<HTMLButtonElement | null>(null)

        expose({ $el: buttonRef })

        return () => [
          props.text && h('button', { ref: buttonRef }),
          h('p', props.text),
        ]
      },

    })

    mount(defineComponent({
      setup() {
        const targetEl = ref<InstanceType<typeof helperComponent> | null>(null)
        const myText = ref('')

        expect(unrefElement(targetEl)).toBeNull()

        onMounted(() => {
          expect(targetEl.value?.$el).toBeNull()
          expect(unrefElement(targetEl)).toEqual(targetEl.value?.$el)

          myText.value = 'Hello'
          nextTick(() => {
            expect(targetEl.value?.$el).not.toBeNull()
            expect(unrefElement(targetEl)).toEqual(targetEl.value?.$el)
          })
        })

        return () => h(helperComponent, { ref: targetEl, text: myText.value })
      },
    }))
  })
})
