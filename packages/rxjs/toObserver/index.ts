import { NextObserver } from 'rxjs'
import { Ref } from 'vue-demi'

export function toObserver<T>(value: Ref<T>): NextObserver<T> {
  return {
    next: (val: T) => {
      value.value = val
    },
  }
}
