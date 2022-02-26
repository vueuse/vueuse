
import { computed, createVNode, ref, render } from 'vue-demi'
import type { Fn } from '@vueuse/shared'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { MaybeElementRef } from '../unrefElement'
import { ContextMenu } from './component'

export interface MenuItem {
  text: string
  handler: Fn
}

export interface MenuPosition {
  x: Number
  y: Number
}

export function useContextMenu(element: MaybeElementRef,
  items: MenuItem[]) {
  const target = computed(() => unrefElement(element))
  const position = ref<MenuPosition>({ x: 0, y: 0 })

  const menu = computed(() => createVNode(ContextMenu, { items, position }))

  const show = (e: MouseEvent) => {
    e.preventDefault()
    position.value.x = e.clientX
    position.value.y = e.clientY
    render(menu.value, target.value as Element)
  }

  useEventListener(target, 'contextmenu', show, { passive: false })
}
