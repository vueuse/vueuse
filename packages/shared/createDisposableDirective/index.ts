import type { DirectiveBinding, EffectScope, FunctionDirective, ObjectDirective, VNode } from 'vue'
import { effectScope } from 'vue'

type originDirective<H, V, A> = FunctionDirective<H, V, string, A> | ObjectDirective<H, V, string, A>

/**
 * Utility for creating disposable directive
 *
 * @see https://vueuse.org/createDisposableDirective
 *
 * @__NO_SIDE_EFFECTES__
 */
export function createDisposableDirective<H extends HTMLElement, V, A = any>(origin: originDirective<H, V, A> = {}): ObjectDirective<H, V, string, A> {
  function isFunc(fn: unknown) {
    return typeof fn === 'function'
  }

  function createTargetDirective<H extends HTMLElement, V, A>(origin: ObjectDirective<H, V, string, A>) {
    const { mounted, unmounted } = origin

    if (!isFunc(mounted))
      return origin

    const scopeWeakMap = new WeakMap<H, EffectScope>()

    return {
      ...origin,
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

  if (isFunc(origin)) {
    return createTargetDirective<H, V, A>({
      mounted: origin,
      updated: origin,
    })
  }

  return createTargetDirective<H, V, A>(origin)
}
