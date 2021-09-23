/* this implementation is original ported from https://github.com/shorwood/pompaute by Stanley Horwood */

import { Ref } from 'vue-demi'

/**
 * Convert a `Promise` or an async `Function` by binding it's to a ref.
 * Useful when you want to bind the loading state of multiple promises to a ref.
 * @param isLoading Reactive `Ref` used to store the state.
 * @param asyncFuncOrPromise Function or Promise to wrap.
 */
export function loadify<R>(isLoading: Ref<boolean>, promise: Promise<R>): Promise<R>
export function loadify<R, TS extends any[]>(isLoading: Ref<boolean>, asyncFunction: (...args: TS) => Promise<R>): (...args: TS) => Promise<R>
export function loadify<R, TS extends any[]>(isLoading: Ref<boolean>, asyncFuncOrPromise: ((...args: TS) => Promise<R>) | Promise<R>): ((...args: TS) => Promise<R>) | Promise<R> {
  // Wrap the function.
  async function wrapped(...args: TS): Promise<R> {
    // Start the loading.
    isLoading.value = true

    // Get promise.
    const promise = asyncFuncOrPromise instanceof Function
      ? asyncFuncOrPromise(...args)
      : asyncFuncOrPromise

    // Await promise and end loading.
    return await promise.finally(() => isLoading.value = false)
  }

  return (asyncFuncOrPromise instanceof Function)
    ? wrapped
    // @ts-ignore
    : wrapped()
}
