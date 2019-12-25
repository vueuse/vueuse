import { useNetwork } from '../useNetwork'

export function useOnline () {
  const { online } = useNetwork()
  return online
}
