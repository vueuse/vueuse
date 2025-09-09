import type { Position, RenderableComponent, UseDraggableOptions } from '@vueuse/core'
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
      toValue(props.initialValue) || { x: 0, y: 0 },
      isClient
        ? props.storageType === 'session'
          ? sessionStorage
          : localStorage
        : undefined,
    )
    const initialValue = storageValue || props.initialValue || { x: 0, y: 0 }
    const onEnd = (position: Position, event: PointerEvent) => {
      props.onEnd?.(position, event)
      if (!storageValue)
        return
      storageValue.value.x = position.x
      storageValue.value.y = position.y
    }

    const data = reactive(useDraggable(target, {
      ...props,
      handle,
      initialValue,
      onEnd,
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
