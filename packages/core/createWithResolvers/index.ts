interface Resolvers<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

function withResolvers<T>(): Resolvers<T> {
  let resolve: ((value: T | PromiseLike<T>) => void) | undefined
  let reject: ((reason?: any) => void) | undefined

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  if (!resolve || !reject) {
    throw new Error('Failed to initialize promise resolvers')
  }

  return { promise, resolve, reject }
}
export const createWithResolvers = Promise.withResolvers ?? withResolvers
