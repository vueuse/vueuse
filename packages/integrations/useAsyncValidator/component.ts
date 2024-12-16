import type { Rules } from 'async-validator'
import type { PropType } from 'vue'
import { defineComponent, reactive } from 'vue'
import { useAsyncValidator } from '.'

export const UseAsyncValidator = /* #__PURE__ */ defineComponent({
  name: 'UseAsyncValidator',
  props: {
    form: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    rules: {
      type: Object as PropType<Rules>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const data = reactive(useAsyncValidator(props.form, props.rules))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
