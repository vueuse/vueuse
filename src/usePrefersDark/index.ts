import { useMediaQuery } from '../useMediaQuery'

export function usePrefersDark () {
  return useMediaQuery('(prefers-color-scheme: dark)')
}
