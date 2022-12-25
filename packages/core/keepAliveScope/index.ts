import { effectScope, getCurrentScope, onActivated, onDeactivated, onScopeDispose } from 'vue-demi'
import type { EffectScope } from 'vue-demi'

export function keepAliveScope(callback: () => void) {
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

  onActivated(start)
  onDeactivated(stop)
  onScopeDispose(stop)

  start()
}
