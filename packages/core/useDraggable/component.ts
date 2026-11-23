import type { RenderableComponent, UseDraggableOptions } from '@vueuse/core'
import type { SlotsType } from 'vue'
import { isClient, useDraggable, useStorage } from '@vueuse/core'
import { computed, defineComponent, h, reactive, shallowRef, toValue } from 'vue'

export interface UseDraggableProps extends UseDraggableOptions, RenderableComponent {
  /**
   * When provided, use `useStorage` to preserve element's position
   */
  storageKey?: string

  /**
   * Storage type
   *
   * @default 'local'
   */
  storageType?: 'local' | 'session'
}

export const UseDraggable = /* #__PURE__ */ defineComponent<
  UseDraggableProps,
  Record<string, never>,
  string,
  SlotsType<any>
>(
  (props, { slots }) => {
    const target = shallowRef<HTMLElement | SVGElement | null>()
    const handle = computed(() => toValue(props.handle) ?? target.value)
    const containerElement = computed(() => props.containerElement as (HTMLElement | SVGElement | null | undefined) ?? undefined)
    const disabled = computed(() => !!props.disabled)
    const storageValue = props.storageKey && useStorage(
      props.storageKey,
      props.initials?.position ?? props.initialValue ?? { x: 0, y: 0 },
      isClient
        ? props.storageType === 'session'
          ? sessionStorage
          : localStorage
        : undefined,
    )
    // the storage ref is used as the internal state, so the position is persisted on change
    const initials = storageValue
      ? { position: storageValue }
      : props.initials

    const data = reactive(useDraggable(target, {
      ...props,
      handle,
      initials,
      disabled,
      containerElement,
    }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target, style: `touch-action:none;${data.style}` }, slots.default(data))
    }
  },
  {
    name: 'UseDraggable',
    props: [
      'storageKey',
      'storageType',
      'initialValue',
      'initials',
      'exact',
      'preventDefault',
      'stopPropagation',
      'pointerTypes',
      'as',
      'handle',
      'axis',
      'onStart',
      'onMove',
      'onEnd',
      'disabled',
      'buttons',
      'containerElement',
      'capture',
      'draggingElement',
    ],
  },
)
