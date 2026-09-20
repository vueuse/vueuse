import type { DirectiveBinding, EffectScope, FunctionDirective, ObjectDirective, VNode } from 'vue'
import { effectScope } from 'vue'

type originDirective<H, V, A> = FunctionDirective<H, V, string, A> | ObjectDirective<H, V, string, A>

/**
 * Utility for authoring disposable directives. Reactive effects created within `mounted` directive hook will be tracked and automatically disposed when directive is unmounted.
 *
 * @see https://vueuse.org/createDisposableDirective
 *
 * @__NO_SIDE_EFFECTS__
 */
export function createDisposableDirective<H extends HTMLElement, V, A = any>(origin: originDirective<H, V, A> = {}): originDirective<H, V, A> {
  function isFunc(fn: unknown) {
    return typeof fn === 'function'
  }

  const normalisedOrigin = isFunc(origin) ? { mounted: origin, updated: origin } : origin

  const { mounted, unmounted } = normalisedOrigin

  if (!isFunc(mounted))
    return origin

  const scopeWeakMap = new WeakMap<H, EffectScope>()

  return {
    ...normalisedOrigin,
    mounted(el: H, binding: DirectiveBinding<V, string, A>, vNode: VNode<any, H>, prevNode: null) {
      const scope = scopeWeakMap.get(el) ?? effectScope()
      scopeWeakMap.set(el, scope)
      scope.run(() => {
        mounted?.(el, binding, vNode, prevNode)
      })
    },
    unmounted(el: H, binding: DirectiveBinding<V, string, A>, vNode: VNode<any, H>, prevNode: null) {
      scopeWeakMap.get(el)?.stop()
      scopeWeakMap.delete(el)
      if (isFunc(unmounted)) {
        unmounted(el, binding, vNode, prevNode)
      }
    },
  }
}
