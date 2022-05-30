/* eslint-disable @typescript-eslint/no-unused-vars */
export interface UseRetryOptions {
  maxRetries?: number
  interval?: number
  timeout?: number
}

// TODO @Shinigami92 2022-05-30: Find out how to exactly type R so it can be used in the callback
export async function useRetry<T extends (...args: any) => R | Promise<R>, R = ReturnType<T>>(
  source: T,
  cb: (result: R) => boolean | Promise<boolean>,
  options: UseRetryOptions = {},
): Promise<R> {
  const {
    maxRetries = 3,
    interval = 100,
    timeout = 1000,
  } = options

  let fulfilled = false
  let retries = 0

  let returnValue: R

  // TODO @Shinigami92 2022-05-30: Use interval and timeout
  do {
    retries++
    returnValue = await source()
    fulfilled = await cb(returnValue)
  } while (!fulfilled && retries <= maxRetries)

  return returnValue
}
