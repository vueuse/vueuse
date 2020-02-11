import { useMediaQuery } from '../useMediaQuery'

export function usePreferredDark() {
  return useMediaQuery('(prefers-color-scheme: dark)')
}
