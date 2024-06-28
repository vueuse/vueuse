/**
 * The source code is an alternative implementation that is incompatible with Promise.withResolvers
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
 */
export interface Resolvers<T = any> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

function withResolvers<T = any>(): Resolvers<T> {
  let resolve: ((value: T | PromiseLike<T>) => void) | undefined
  let reject: ((reason?: any) => void) | undefined

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  if (!resolve || !reject) {
    throw new Error('withResolvers Failed to initialize promise resolvers')
  }

  return { promise, resolve, reject }
}
/**
 * Utility for creating a new Promise object and two functions to resolve or reject it
 *
 * @see https://vueuse.org/createWithResolvers
 */
export const createWithResolvers = Promise.withResolvers ?? withResolvers
