import { computed, ref } from 'vue-demi'
import type { ComputedRef, Ref } from 'vue-demi'

export function useSelections<T>(items: T[], defaultSelected: T[] = []) {
  const selected = ref<T[]>(defaultSelected) as Ref<T[]>
  const selectedSet = computed(() => new Set(selected.value)) as ComputedRef<Set<T>>
  const isSelected = (item: T) => selectedSet.value.has(item)

  const select = (item: T) => {
    selectedSet.value.add(item)
    selected.value = Array.from(selectedSet.value)
  }
  const unSelect = (item: T) => {
    selectedSet.value.delete(item)
    selected.value = Array.from(selectedSet.value)
  }

  const toggle = (item: T) => {
    if (isSelected(item))
      unSelect(item)
    else
      select(item)
  }
  const selectAll = () => {
    items.forEach((o) => {
      selectedSet.value.add(o)
    })
    selected.value = Array.from(selectedSet.value)
  }
  const unSelectAll = () => {
    items.forEach((o) => {
      selectedSet.value.delete(o)
    })
    selected.value = Array.from(selectedSet.value)
  }

  const noneSelected = computed(() => items.every(o => !selectedSet.value.has(o)))

  const allSelected = computed(() => items.every(o => selectedSet.value.has(o)) && !noneSelected.value)

  const partiallySelected = computed(() => !noneSelected.value && !allSelected.value)

  const toggleAll = () => (allSelected.value ? unSelectAll() : selectAll())

  return {
    selected,
    noneSelected,
    allSelected,
    partiallySelected,
    isSelected,
    select,
    unSelect,
    toggle,
    selectAll,
    unSelectAll,
    toggleAll,
  } as const
}
