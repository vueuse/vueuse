import { ref, set } from 'vue-demi'
import { syncRef } from '../syncRef'
import { tryOnUnmounted } from '../tryOnUnmounted'

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

  // FIXME Use ref instead of computed, I don't know why, but it works now.
  const reactiveSet = ref(inner.value)

  const stop = syncRef(inner, reactiveSet)

  function onMutate() {
    set(reactiveSet, 'value', reactiveSet.value)
  }

  tryOnUnmounted(stop)

  return reactiveSet
}
