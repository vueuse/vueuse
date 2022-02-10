import { computed, ref } from 'vue-demi'

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

  const noneSelected = computed(() => selectedAry.value.length === 0)

  const allSelected = computed(() => selectedAry.value.length === items.length)

  const partiallySelected = computed(() => !noneSelected.value && !allSelected.value)

  const isSelected = (item: T) => selected.value.has(item)

  const select = (item?: T) => {
    if (item !== undefined) {
      selected.value.add(item)
    }
    else {
      items.forEach((o) => {
        selected.value.add(o)
      })
    }
  }

  const unSelect = (item?: T) => {
    if (item !== undefined) {
      selected.value.delete(item)
    }
    else {
      items.forEach((o) => {
        selected.value.delete(o)
      })
    }
  }

  const toggle = (item?: T) => {
    if (item !== undefined)
      isSelected(item) ? unSelect(item) : select(item)

    else
      allSelected.value ? unSelect() : select()
  }

  return {
    selected: selectedAry,
    noneSelected,
    allSelected,
    partiallySelected,
    isSelected,
    select,
    unSelect,
    toggle,
  }
}

export type UseSelectionsReturn = ReturnType<typeof useSelections>
