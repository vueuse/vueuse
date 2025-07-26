import type { NextObserver } from 'rxjs'
import type { Ref } from 'vue'

/* @__NO_SIDE_EFFECTS__ */
export function toObserver<T>(value: Ref<T>): NextObserver<T> {
  return {
    next: (val: T) => {
      value.value = val
    },
  }
}
