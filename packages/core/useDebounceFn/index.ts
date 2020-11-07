export function useDebounceFn<T extends Function, D extends number>(fn: T, delay: D = 200 as any ): D extends 0 ? T : () => void {
  if (delay <= 0)
    return fn as any

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

  return wrapper as any
}
