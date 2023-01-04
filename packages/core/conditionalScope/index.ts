import type { EffectScope, WatchSource } from 'vue-demi'
import { effectScope, getCurrentScope, watch } from 'vue-demi'

export function conditionalScope<T>(source: WatchSource<T>, callback: () => void) {
  let scope: EffectScope | undefined
  const parentScope = getCurrentScope()

  function start() {
    if (scope)
      return
    scope = parentScope?.run(() => effectScope()) || effectScope()
    scope.run(callback)
  }

  function stop() {
    if (!scope)
      return
    scope.stop()
    scope = undefined
  }

  watch(source, (condition) => {
    if (condition)
      start()
    else stop()
  }, { immediate: true })
}
