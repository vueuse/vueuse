import type { SlotsType } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { toRefs } from '@vueuse/shared'
import { defineComponent } from 'vue'

export interface UseObjectUrlProps {
  object: Blob | MediaSource | undefined
}
interface UseObjectUrlSlots {
  default: (data: Readonly<string | undefined>) => any
}

export const UseObjectUrl = /* #__PURE__ */ defineComponent<
  UseObjectUrlProps,
  Record<string, never>,
  string,
  SlotsType<UseObjectUrlSlots>
>(
  (props, { slots }) => {
    const { object } = toRefs(props)
    const url = useObjectUrl(object)

    return () => {
      if (slots.default && url.value)
        return slots.default(url.value)
    }
  },
  {
    name: 'UseObjectUrl',
    props: ['object'],
  },
)
