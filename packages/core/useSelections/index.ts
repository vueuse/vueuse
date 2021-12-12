import { ref, computed } from 'vue-demi'

/**
 * Multiple selection controller.
 *
 * @see https://vueuse.org/useSelections
 * @param items: T[]
 * @param defaultSelected: T[] = []
 */

export function useSelections<T>(items: T[], defaultSelected: T[] = []) {
  const selected = ref<Set<T>>(new Set(defaultSelected))
  const selectedAry = computed(() => Array.from(selected.value))
  const isSelected = (item: T) => selected.value.has(item)

  const select = (item: T) => {
    selected.value.add(item)
  }

  const unSelect = (item: T) => {
    selected.value.delete(item)
  }

  const toggle = (item: T) => {
    if (isSelected(item))
      unSelect(item)

    else
      select(item)
  }

  const selectAll = () => {
    items.forEach((o) => {
      selected.value.add(o)
    })
  }

  const unSelectAll = () => {
    items.forEach((o) => {
      selected.value.delete(o)
    })
  }

  const noneSelected = computed(() => items.every(o => !selected.value.has(o)))

  const allSelected = computed(() => items.every(o => selected.value.has(o) && !noneSelected.value))

  const partiallySelected = computed(() => !noneSelected.value && !allSelected.value)

  const toggleAll = () => (allSelected.value ? unSelectAll() : selectAll())

  return {
    selected: selectedAry,
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
  }
}

export type UseSelectionsReturn = ReturnType<typeof useSelections>
