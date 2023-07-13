import { useSlots } from 'vue-demi'

export function useHasSlot() {
  function hasSlot(name: string) {
    const slot = useSlots()
    return !!slot[name]
  }

  return hasSlot
}
