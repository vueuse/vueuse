import { defineComponent, toRef } from 'vue-demi'
import { useObjectUrl } from '@vueuse/core'

export interface UseObjectUrlProps {
  object: Blob | MediaSource | undefined
}

export const UseObjectUrl = /* #__PURE__ */ defineComponent<UseObjectUrlProps>({
  name: 'UseObjectUrl',
  props: [
    'object',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const object = toRef(props, 'object')
    const url = useObjectUrl(object)

    return () => {
      if (slots.default && url.value)
        return slots.default(url)
    }
  },
})
