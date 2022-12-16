import { computed, ref, set } from 'vue-demi'

export type SetConstructorArgument<T> = readonly T[] | null | Set<T>

export default class ReactiveSet<T> extends Set<T> {
  constructor(
    private readonly onMutate: () => void,
    values?: SetConstructorArgument<T>,
  ) {
    super(values)
  }

  add(value: T) {
    super.add(value)
    this.onMutate()

    return this
  }

  delete(value: T): boolean {
    const res = super.delete(value)
    this.onMutate()
    return res
  }

  clear() {
    super.clear()
    this.onMutate()
  }
}

/**
 * Create a ref of a reactive Set. To be compatible with Vue 2.
 */
export function useReactiveSet<T>(values?: SetConstructorArgument<T>) {
  const inner = ref(new ReactiveSet<T>(onMutate, values))

  const reactiveSet = computed<Set<T>>({
    get: () => {
      return inner.value
    },
    set: (set: Set<T>) => {
      inner.value = new ReactiveSet(onMutate, set)
    },
  })

  function onMutate() {
    set(reactiveSet, 'value', reactiveSet.value)
  }

  return reactiveSet
}
