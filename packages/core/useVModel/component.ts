import { defineComponent, h } from 'vue-demi'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'UseVModel',
  props: {
    data: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const data = useVModel(props, 'data', emit)
    const update = (event: Event) => {
      data.value = (<HTMLInputElement>event.target).value
    }
    return () => {
      return h('div', null, [
        h('div', { innerHTML: data.value }),
        h('input', { value: props.data, oninput: update }),
      ])
    }
  },
})
