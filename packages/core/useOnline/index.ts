import { useNetwork } from '../useNetwork'

export function useOnline () {
  const { isOnline } = useNetwork()
  return isOnline
}
