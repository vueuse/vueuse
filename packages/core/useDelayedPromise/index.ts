export async function useDelayedPromise<T>(promise: Promise<T>, ms: number) {
  const [p] = await Promise.all([promise, new Promise(resolve => setTimeout(resolve, ms))])

  return p
}
