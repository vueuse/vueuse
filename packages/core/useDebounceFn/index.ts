export function useDebounceFn<T extends Function>(fn: T, delay = 200): T {
  if (delay <= 0)
    return fn

  let timer: ReturnType<typeof setTimeout> | undefined

  function wrapper(this: any, ...args: any[]) {
    const exec = () => {
      timer = undefined
      return fn.apply(this, args)
    }

    if (timer)
      clearTimeout(timer)

    timer = setTimeout(exec, delay)
  }

  return wrapper as any as T
}
